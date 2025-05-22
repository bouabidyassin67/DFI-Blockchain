
import React from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Payments = () => {
  // Sample payment data
  const paymentHistory = [
    {
      id: "INV-2024-001",
      date: "Jan 15, 2024",
      course: "Introduction to Computer Science",
      amount: 99.99,
      status: "Paid",
    },
    {
      id: "INV-2024-002",
      date: "Feb 10, 2024",
      course: "Advanced Web Development",
      amount: 149.99,
      status: "Paid",
    },
    {
      id: "INV-2024-003",
      date: "Mar 05, 2024",
      course: "Data Science Fundamentals",
      amount: 129.99,
      status: "Paid",
    },
    {
      id: "INV-2024-004",
      date: "Apr 20, 2024",
      course: "Machine Learning Essentials",
      amount: 199.99,
      status: "Processing",
    },
  ];

  const subscriptions = [
    {
      id: "SUB-2023-001",
      plan: "Learning Pro Monthly",
      startDate: "Aug 15, 2023",
      nextBilling: "May 15, 2024",
      amount: 19.99,
      status: "Active",
    },
  ];

  const paymentMethods = [
    {
      id: "PM-001",
      type: "Credit Card",
      last4: "4242",
      expiry: "09/25",
      isDefault: true,
    },
    {
      id: "PM-002",
      type: "PayPal",
      email: "jane.doe@example.com",
      isDefault: false,
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
              </div>

              <Tabs defaultValue="history">
                <TabsList>
                  <TabsTrigger value="history">Payment History</TabsTrigger>
                  <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                  <TabsTrigger value="methods">Payment Methods</TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                            <tr>
                              <th scope="col" className="px-6 py-3">Invoice</th>
                              <th scope="col" className="px-6 py-3">Date</th>
                              <th scope="col" className="px-6 py-3">Course</th>
                              <th scope="col" className="px-6 py-3">Amount</th>
                              <th scope="col" className="px-6 py-3">Status</th>
                              <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paymentHistory.map((payment) => (
                              <tr key={payment.id} className="bg-muted/20 border-b">
                                <td className="px-6 py-4 font-medium">{payment.id}</td>
                                <td className="px-6 py-4">{payment.date}</td>
                                <td className="px-6 py-4">{payment.course}</td>
                                <td className="px-6 py-4">${payment.amount}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded-full text-xs ${payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {payment.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4 mr-1" />
                                    Receipt
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="subscriptions" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Subscriptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                            <tr>
                              <th scope="col" className="px-6 py-3">ID</th>
                              <th scope="col" className="px-6 py-3">Plan</th>
                              <th scope="col" className="px-6 py-3">Start Date</th>
                              <th scope="col" className="px-6 py-3">Next Billing</th>
                              <th scope="col" className="px-6 py-3">Amount</th>
                              <th scope="col" className="px-6 py-3">Status</th>
                              <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subscriptions.map((subscription) => (
                              <tr key={subscription.id} className="bg-muted/20 border-b">
                                <td className="px-6 py-4 font-medium">{subscription.id}</td>
                                <td className="px-6 py-4">{subscription.plan}</td>
                                <td className="px-6 py-4">{subscription.startDate}</td>
                                <td className="px-6 py-4">{subscription.nextBilling}</td>
                                <td className="px-6 py-4">${subscription.amount}/month</td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                    {subscription.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                    Cancel
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="methods" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Methods</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {paymentMethods.map((method) => (
                        <Card key={method.id} className="bg-muted/20">
                          <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center space-x-4">
                              {method.type === "Credit Card" ? (
                                <CreditCard className="h-8 w-8" />
                              ) : (
                                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                  P
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{method.type}</p>
                                <p className="text-sm text-muted-foreground">
                                  {method.type === "Credit Card" ? `**** ${method.last4} (expires ${method.expiry})` : method.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {method.isDefault && (
                                <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-1">
                                  Default
                                </span>
                              )}
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              {!method.isDefault && (
                                <Button variant="outline" size="sm">
                                  Set Default
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      <Button className="mt-2">
                        + Add Payment Method
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Payments;
