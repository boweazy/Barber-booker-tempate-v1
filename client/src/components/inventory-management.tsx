import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, AlertTriangle, ShoppingCart, TrendingDown, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Inventory, RetailSale, Barber } from "@shared/schema";

export function InventoryManagement() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSaleDialog, setShowSaleDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch inventory
  const { data: inventory = [] } = useQuery<Inventory[]>({
    queryKey: ["/api/inventory"],
  });

  // Fetch retail sales
  const { data: sales = [] } = useQuery<RetailSale[]>({
    queryKey: ["/api/retail-sales"],
  });

  // Fetch barbers for sales assignment
  const { data: barbers = [] } = useQuery<Barber[]>({
    queryKey: ["/api/barbers"],
  });

  const addInventoryMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      category: string;
      currentStock: number;
      minimumStock: number;
      unitCost: number;
      retailPrice: number;
      supplier?: string;
    }) => {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          unitCost: Math.round(data.unitCost * 100), // convert to cents
          retailPrice: Math.round(data.retailPrice * 100) // convert to cents
        })
      });
      if (!response.ok) throw new Error("Failed to add inventory item");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Inventory item added successfully" });
      setShowAddDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    }
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ itemId, quantity, operation }: { 
      itemId: number; 
      quantity: number; 
      operation: "add" | "subtract" 
    }) => {
      const response = await fetch(`/api/inventory/${itemId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity, operation })
      });
      if (!response.ok) throw new Error("Failed to update stock");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Stock updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    }
  });

  const recordSaleMutation = useMutation({
    mutationFn: async (data: {
      inventoryId: number;
      barberId: number;
      quantity: number;
      unitPrice: number;
      paymentMethod: string;
      clientId?: number;
    }) => {
      const response = await fetch("/api/retail-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          unitPrice: Math.round(data.unitPrice * 100), // convert to cents
          totalAmount: Math.round(data.unitPrice * data.quantity * 100)
        })
      });
      if (!response.ok) throw new Error("Failed to record sale");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Sale recorded successfully" });
      setShowSaleDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/retail-sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    }
  });

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
  };

  const categories = ["all", "product", "supply", "tool"];
  const filteredInventory = selectedCategory === "all" 
    ? inventory 
    : inventory.filter(item => item.category === selectedCategory);

  const lowStockItems = inventory.filter(item => 
    item.currentStock <= item.minimumStock
  );

  const getTotalSalesValue = () => {
    return sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  };

  const getTopSellingItems = () => {
    const salesByItem = sales.reduce((acc, sale) => {
      acc[sale.inventoryId] = (acc[sale.inventoryId] || 0) + sale.quantity;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(salesByItem)
      .map(([itemId, quantity]) => {
        const item = inventory.find(i => i.id === Number(itemId));
        return { item, quantity };
      })
      .filter(({ item }) => item)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Inventory Management</h2>
          <p className="text-slate-600 mt-1">Track stock levels, usage, and retail sales</p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Package className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                addInventoryMutation.mutate({
                  name: formData.get("name") as string,
                  category: formData.get("category") as string,
                  currentStock: Number(formData.get("currentStock")),
                  minimumStock: Number(formData.get("minimumStock")),
                  unitCost: Number(formData.get("unitCost")),
                  retailPrice: Number(formData.get("retailPrice")),
                  supplier: formData.get("supplier") as string
                });
              }} className="space-y-4">
                <div>
                  <Label htmlFor="name">Item Name</Label>
                  <Input name="name" placeholder="Product name..." required />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="supply">Supply</SelectItem>
                      <SelectItem value="tool">Tool</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentStock">Current Stock</Label>
                    <Input name="currentStock" type="number" min="0" required />
                  </div>
                  <div>
                    <Label htmlFor="minimumStock">Minimum Stock</Label>
                    <Input name="minimumStock" type="number" min="1" defaultValue="5" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="unitCost">Unit Cost ($)</Label>
                    <Input name="unitCost" type="number" step="0.01" min="0" required />
                  </div>
                  <div>
                    <Label htmlFor="retailPrice">Retail Price ($)</Label>
                    <Input name="retailPrice" type="number" step="0.01" min="0" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input name="supplier" placeholder="Supplier name..." />
                </div>
                <Button type="submit" className="w-full" disabled={addInventoryMutation.isPending}>
                  {addInventoryMutation.isPending ? "Adding..." : "Add Item"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">{inventory.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatPrice(getTotalSalesValue())}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{categories.length - 1}</div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStockItems.map((item) => (
                <div key={item.id} className="p-3 bg-white rounded-lg border border-orange-200">
                  <div className="font-medium text-orange-900">{item.name}</div>
                  <div className="text-sm text-orange-700">
                    Current: {item.currentStock} | Minimum: {item.minimumStock}
                  </div>
                  <Button
                    size="sm"
                    className="mt-2 w-full bg-orange-600 hover:bg-orange-700"
                    onClick={() => {
                      const quantity = prompt("Add stock quantity:");
                      if (quantity && Number(quantity) > 0) {
                        updateStockMutation.mutate({
                          itemId: item.id,
                          quantity: Number(quantity),
                          operation: "add"
                        });
                      }
                    }}
                  >
                    Restock
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex items-center space-x-4">
        <Label>Filter by category:</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="product">Products</SelectItem>
            <SelectItem value="supply">Supplies</SelectItem>
            <SelectItem value="tool">Tools</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredInventory.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <Badge variant={item.category === "product" ? "default" : "secondary"}>
                  {item.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Stock</span>
                <span className={`font-bold ${
                  item.currentStock <= item.minimumStock ? "text-orange-600" : "text-slate-800"
                }`}>
                  {item.currentStock}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Cost</span>
                <span className="font-medium">{formatPrice(item.unitCost)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Price</span>
                <span className="font-bold text-teal-600">{formatPrice(item.retailPrice)}</span>
              </div>
              {item.supplier && (
                <div className="text-xs text-slate-500">
                  Supplier: {item.supplier}
                </div>
              )}
              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    const quantity = prompt("Remove quantity:");
                    if (quantity && Number(quantity) > 0) {
                      updateStockMutation.mutate({
                        itemId: item.id,
                        quantity: Number(quantity),
                        operation: "subtract"
                      });
                    }
                  }}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    const quantity = prompt("Add quantity:");
                    if (quantity && Number(quantity) > 0) {
                      updateStockMutation.mutate({
                        itemId: item.id,
                        quantity: Number(quantity),
                        operation: "add"
                      });
                    }
                  }}
                >
                  <Plus className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowSaleDialog(true);
                  }}
                >
                  Sell
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Selling Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingDown className="w-5 h-5 mr-2 text-teal-600" />
            Top Selling Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getTopSellingItems().map(({ item, quantity }, index) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-slate-600">{item.category}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{quantity} sold</div>
                  <div className="text-sm text-slate-600">{formatPrice(item.retailPrice)}</div>
                </div>
              </div>
            ))}
          </div>
          {getTopSellingItems().length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No sales recorded yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sale Dialog */}
      <Dialog open={showSaleDialog} onOpenChange={setShowSaleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Retail Sale</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              recordSaleMutation.mutate({
                inventoryId: selectedItem.id,
                barberId: Number(formData.get("barberId")),
                quantity: Number(formData.get("quantity")),
                unitPrice: Number(formData.get("unitPrice")),
                paymentMethod: formData.get("paymentMethod") as string,
                clientId: formData.get("clientId") ? Number(formData.get("clientId")) : undefined
              });
            }} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="font-medium">{selectedItem.name}</div>
                <div className="text-sm text-slate-600">
                  Current stock: {selectedItem.currentStock} | Price: {formatPrice(selectedItem.retailPrice)}
                </div>
              </div>
              <div>
                <Label htmlFor="barberId">Barber</Label>
                <Select name="barberId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select barber" />
                  </SelectTrigger>
                  <SelectContent>
                    {barbers.map((barber) => (
                      <SelectItem key={barber.id} value={barber.id.toString()}>
                        {barber.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    name="quantity" 
                    type="number" 
                    min="1" 
                    max={selectedItem.currentStock}
                    defaultValue="1"
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="unitPrice">Unit Price ($)</Label>
                  <Input 
                    name="unitPrice" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    defaultValue={(selectedItem.retailPrice / 100).toString()}
                    required 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select name="paymentMethod" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={recordSaleMutation.isPending}>
                {recordSaleMutation.isPending ? "Recording..." : "Record Sale"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}