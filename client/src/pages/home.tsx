import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Table, 
  Trash2, 
  Mail, 
  Copy, 
  Check,
  Edit,
  Save,
  X,
  Search
} from "lucide-react";
import { 
  CustomerData, 
  PaymentInfo,
  parseCustomerData, 
  generateMessageForCustomer, 
  copyToClipboard 
} from "@/lib/utils";

export default function Home() {
  const [rawData, setRawData] = useState("");
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [showParsedData, setShowParsedData] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{[key: number]: boolean}>({});
  const [editModes, setEditModes] = useState<{[key: number]: boolean}>({});
  const [editableData, setEditableData] = useState<CustomerData[]>([]);
  const [completedCustomers, setCompletedCustomers] = useState<{[key: string]: boolean}>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMessage, setEditingMessage] = useState<{[key: number]: string}>({});
  const [paymentInfo, setPaymentInfo] = useState({
    zelle: "hasnath@fairpy.com",
    venmo: "@fairpy",
    cashApp: "$hasanath",
    paypal: "hasnath@fairpy.com"
  });
  const [dateConfig, setDateConfig] = useState({
    yesterdayDate: "06/19",
    currentDate: "06/20"
  });
  const { toast } = useToast();

  const handleParseData = () => {
    if (!rawData.trim()) {
      toast({
        title: "Error",
        description: "Please paste customer data first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsed = parseCustomerData(rawData);
      if (parsed.length === 0) {
        toast({
          title: "Error",
          description: "No valid customer data found. Please check the format.",
          variant: "destructive",
        });
        return;
      }
      
      setCustomerData(parsed);
      setShowParsedData(true);
      setShowMessages(false);
      toast({
        title: "Success",
        description: `Parsed ${parsed.length} customer records.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse customer data. Please check the format.",
        variant: "destructive",
      });
    }
  };

  const handleClearData = () => {
    setRawData("");
    setCustomerData([]);
    setShowParsedData(false);
    setShowMessages(false);
    setCopiedStates({});
  };

  const handleMilesChange = (index: number, miles: string) => {
    const updatedData = [...customerData];
    updatedData[index].miles = parseFloat(miles) || 0;
    setCustomerData(updatedData);
  };

  const handleGenerateMessages = () => {
    if (customerData.length === 0) return;
    // Apply global date config to all customers
    const dataWithDates = customerData.map(customer => ({
      ...customer,
      yesterdayDate: dateConfig.yesterdayDate,
      currentDate: dateConfig.currentDate
    }));
    setEditableData(dataWithDates);
    setShowMessages(true);
    setCopiedStates({});
    setEditModes({});
    setEditingMessage({});
    toast({
      title: "Success",
      description: "Messages generated successfully!",
    });
  };

  const toggleEditMode = (index: number) => {
    setEditModes(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleEditableDataChange = (index: number, field: keyof CustomerData, value: string | number) => {
    const updatedData = [...editableData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setEditableData(updatedData);
  };

  const saveEditChanges = (index: number) => {
    setEditModes(prev => ({ ...prev, [index]: false }));
    toast({
      title: "Changes saved",
      description: "Customer data updated successfully!",
    });
  };

  const handleCopyMessage = async (index: number, message: string, customerName: string) => {
    // Use edited message if available, otherwise use generated message
    const finalMessage = editingMessage[index] || message;
    const success = await copyToClipboard(finalMessage);
    if (success) {
      setCopiedStates(prev => ({ ...prev, [index]: true }));
      // Mark customer as completed using their name as key for persistence
      setCompletedCustomers(prev => ({ ...prev, [customerName]: true }));
      toast({
        title: "Copied!",
        description: "Message copied to clipboard.",
      });
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [index]: false }));
      }, 2000);
    } else {
      toast({
        title: "Error",
        description: "Failed to copy message to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleMessageEdit = (index: number, newMessage: string) => {
    setEditingMessage(prev => ({ ...prev, [index]: newMessage }));
  };

  const handleCompletedToggle = (customerName: string, checked: boolean) => {
    setCompletedCustomers(prev => ({ ...prev, [customerName]: checked }));
  };

  // Filter customers based on search term
  const filteredCustomers = editableData.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <FileText className="text-white text-xl h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Rental Message Generator</h1>
              <p className="text-sm text-slate-500">Generate payment messages for rental customers</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Data Input Section */}
        <Card className="mb-8">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-lg font-semibold text-slate-900">Customer Data Input</CardTitle>
            <p className="text-sm text-slate-600">Paste your tab-separated rental data below</p>
          </CardHeader>
          <CardContent className="p-6">
            {/* Configuration Sections */}
            <div className="space-y-6 mb-6">
              {/* Payment Information Configuration */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <Label className="block text-sm font-medium text-slate-700 mb-3">Payment Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zelle" className="text-xs text-slate-600">Zelle</Label>
                    <Input
                      id="zelle"
                      value={paymentInfo.zelle}
                      onChange={(e) => setPaymentInfo({...paymentInfo, zelle: e.target.value})}
                      placeholder="email@example.com"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="venmo" className="text-xs text-slate-600">Venmo</Label>
                    <Input
                      id="venmo"
                      value={paymentInfo.venmo}
                      onChange={(e) => setPaymentInfo({...paymentInfo, venmo: e.target.value})}
                      placeholder="@username"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cashApp" className="text-xs text-slate-600">Cash App</Label>
                    <Input
                      id="cashApp"
                      value={paymentInfo.cashApp}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cashApp: e.target.value})}
                      placeholder="$username"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paypal" className="text-xs text-slate-600">PayPal</Label>
                    <Input
                      id="paypal"
                      value={paymentInfo.paypal}
                      onChange={(e) => setPaymentInfo({...paymentInfo, paypal: e.target.value})}
                      placeholder="email@example.com"
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Date Configuration */}
              <div className="p-4 bg-green-50 rounded-lg">
                <Label className="block text-sm font-medium text-slate-700 mb-3">Date Configuration</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="yesterdayDate" className="text-xs text-slate-600">Yesterday Date (Earnings Date)</Label>
                    <Input
                      id="yesterdayDate"
                      value={dateConfig.yesterdayDate}
                      onChange={(e) => setDateConfig({...dateConfig, yesterdayDate: e.target.value})}
                      placeholder="MM/DD"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentDate" className="text-xs text-slate-600">Current Date (Rental Date)</Label>
                    <Input
                      id="currentDate"
                      value={dateConfig.currentDate}
                      onChange={(e) => setDateConfig({...dateConfig, currentDate: e.target.value})}
                      placeholder="MM/DD"
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="customerData" className="block text-sm font-medium text-slate-700 mb-2">
                Rental Data <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="customerData"
                rows={8}
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                className="font-mono text-sm"
                placeholder="Paste your customer data here...&#10;Format: Renter Name   Due Yesterday   06/19/2025 Uber Earnings        06/20/2025 Daily Fee    Due/Paid"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleParseData} className="bg-blue-500 hover:bg-blue-600">
                <Table className="w-4 h-4 mr-2" />
                Parse Data
              </Button>
              <Button onClick={handleClearData} variant="secondary">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Parsed Data Section */}
        {showParsedData && (
          <Card className="mb-8">
            <CardHeader className="border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">Customer Records</CardTitle>
                  <p className="text-sm text-slate-600">Review and add miles data for each customer</p>
                </div>
                <div className="bg-blue-50 px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium text-blue-700">
                    {customerData.length} customer{customerData.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-2 font-medium text-slate-700">Renter Name</th>
                      <th className="text-right py-3 px-2 font-medium text-slate-700">Due Yesterday</th>
                      <th className="text-right py-3 px-2 font-medium text-slate-700">Uber Earnings</th>
                      <th className="text-right py-3 px-2 font-medium text-slate-700">Daily Fee</th>
                      <th className="text-right py-3 px-2 font-medium text-slate-700">Balance</th>
                      <th className="text-center py-3 px-2 font-medium text-slate-700">Miles Driven</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerData.map((customer, index) => {
                      const balanceClass = customer.balance >= 0 ? 'text-red-600' : 'text-emerald-600';
                      const balanceSign = customer.balance >= 0 ? '+' : '';
                      
                      return (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-2 font-medium text-slate-900">{customer.name}</td>
                          <td className="py-3 px-2 text-right text-slate-600">${customer.dueYesterday.toFixed(2)}</td>
                          <td className="py-3 px-2 text-right text-slate-600">${customer.uberEarnings.toFixed(2)}</td>
                          <td className="py-3 px-2 text-right text-slate-600">${customer.dailyFee.toFixed(2)}</td>
                          <td className={`py-3 px-2 text-right font-medium ${balanceClass}`}>
                            {balanceSign}${Math.abs(customer.balance).toFixed(2)}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="N/A"
                              className="w-20 text-center"
                              value={customer.miles > 0 ? customer.miles : ''}
                              onChange={(e) => handleMilesChange(index, e.target.value)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <Button onClick={handleGenerateMessages} className="bg-emerald-500 hover:bg-emerald-600">
                  <Mail className="w-4 h-4 mr-2" />
                  Generate Messages
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Messages Section */}
        {showMessages && (
          <Card>
            <CardHeader className="border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">Generated Messages</CardTitle>
                  <p className="text-sm text-slate-600">Copy individual messages to send to customers</p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-emerald-50 px-3 py-2 rounded-lg">
                    <span className="text-sm font-medium text-emerald-700">
                      {filteredCustomers.length} of {customerData.length} message{customerData.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="bg-green-50 px-3 py-2 rounded-lg">
                    <span className="text-sm font-medium text-green-700">
                      {Object.values(completedCustomers).filter(Boolean).length} completed
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            {/* Search Bar */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search customers by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>
            <div className="divide-y divide-slate-200">
              {filteredCustomers.length === 0 && searchTerm ? (
                <div className="p-6 text-center text-slate-500">
                  No customers found matching "{searchTerm}"
                </div>
              ) : (
                filteredCustomers.map((customer, index) => {
                  // Find the original index for state management
                  const originalIndex = editableData.findIndex(c => c.name === customer.name);
                  const message = generateMessageForCustomer(customer, paymentInfo);
                  const isCopied = copiedStates[originalIndex];
                  const isEditing = editModes[originalIndex];
                
                  return (
                    <div key={customer.name} className={`p-6 ${completedCustomers[customer.name] ? 'bg-green-50 border-l-4 border-green-400' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`completed-${customer.name}`}
                              checked={completedCustomers[customer.name] || false}
                              onCheckedChange={(checked) => handleCompletedToggle(customer.name, checked as boolean)}
                            />
                            <Label 
                              htmlFor={`completed-${customer.name}`} 
                              className="text-xs text-slate-500 select-none cursor-pointer"
                            >
                              Completed
                            </Label>
                          </div>
                        <h3 className={`text-lg font-medium ${completedCustomers[customer.name] ? 'text-green-700 line-through' : 'text-slate-900'}`}>
                          {customer.name}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        {isEditing ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => saveEditChanges(originalIndex)}
                                className="bg-emerald-500 hover:bg-emerald-600"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleEditMode(originalIndex)}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleEditMode(originalIndex)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleCopyMessage(originalIndex, message, customer.name)}
                                className={`transition-colors ${
                                  isCopied 
                                    ? 'bg-emerald-500 hover:bg-emerald-600' 
                                    : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy
                                  </>
                                )}
                              </Button>
                            </>
                          )}
                      </div>
                    </div>
                    
                    {isEditing ? (
                      <div className="bg-slate-50 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-xs text-slate-600">Due Yesterday</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={customer.dueYesterday}
                              onChange={(e) => handleEditableDataChange(originalIndex, 'dueYesterday', parseFloat(e.target.value) || 0)}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-slate-600">Uber Earnings</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={customer.uberEarnings}
                              onChange={(e) => handleEditableDataChange(originalIndex, 'uberEarnings', parseFloat(e.target.value) || 0)}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-slate-600">Daily Fee</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={customer.dailyFee}
                              onChange={(e) => handleEditableDataChange(originalIndex, 'dailyFee', parseFloat(e.target.value) || 0)}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-slate-600">Balance</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={customer.balance}
                              onChange={(e) => handleEditableDataChange(originalIndex, 'balance', parseFloat(e.target.value) || 0)}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-slate-600">Miles Driven</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={customer.miles > 0 ? customer.miles : ''}
                              onChange={(e) => handleEditableDataChange(originalIndex, 'miles', parseFloat(e.target.value) || 0)}
                              placeholder="N/A"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-slate-600">Yesterday Date</Label>
                            <Input
                              type="text"
                              value={customer.yesterdayDate || '06/19'}
                              onChange={(e) => handleEditableDataChange(originalIndex, 'yesterdayDate', e.target.value)}
                              placeholder="MM/DD"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-slate-600">Current Date</Label>
                            <Input
                              type="text"
                              value={customer.currentDate || '06/20'}
                              onChange={(e) => handleEditableDataChange(originalIndex, 'currentDate', e.target.value)}
                              placeholder="MM/DD"
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ) : null}
                    
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="mb-2 flex justify-between items-center">
                        <Label className="text-xs text-slate-600">Generated Message</Label>
                        <Label className="text-xs text-slate-500">Click to edit text directly</Label>
                      </div>
                      <Textarea
                        value={editingMessage[originalIndex] || message}
                        onChange={(e) => handleMessageEdit(originalIndex, e.target.value)}
                        className="min-h-[200px] text-sm font-mono leading-relaxed resize-none border-slate-200 focus:border-blue-300"
                        placeholder="Generated message will appear here..."
                      />
                    </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
