import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface CustomerData {
  name: string;
  dueYesterday: number;
  uberEarnings: number;
  dailyFee: number;
  balance: number;
  miles: number;
  yesterdayDate?: string;
  currentDate?: string;
}

export function parseCustomerData(rawData: string): CustomerData[] {
  const lines = rawData.split('\n');
  const customers: CustomerData[] = [];

  // Skip header line and empty lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const columns = line.split('\t');
    if (columns.length >= 5) {
      const customer: CustomerData = {
        name: columns[0].trim(),
        dueYesterday: parseFloat(columns[1].replace(/[$,]/g, '')) || 0,
        uberEarnings: parseFloat(columns[2].replace(/[$,]/g, '')) || 0,
        dailyFee: parseFloat(columns[3].replace(/[$,]/g, '')) || 0,
        balance: parseFloat(columns[4].replace(/[$,]/g, '')) || 0,
        miles: 0, // Will be filled by user
        yesterdayDate: "06/19",
        currentDate: "06/20"
      };
      customers.push(customer);
    }
  }

  return customers;
}

export interface PaymentInfo {
  zelle: string;
  venmo: string;
  cashApp: string;
  paypal: string;
}

export function generateMessageForCustomer(customer: CustomerData, paymentInfo: PaymentInfo): string {
  const isPositiveBalance = customer.balance >= 0;
  const milesDisplay = customer.miles > 0 ? customer.miles.toString() : "N/A";
  const yesterdayDate = customer.yesterdayDate || "06/19";
  const currentDate = customer.currentDate || "06/20";
  
  if (isPositiveBalance) {
    // Template 1 - Customer owes money
    return `Previous outstanding $${customer.dueYesterday.toFixed(2)}
${yesterdayDate} Uber earnings $${customer.uberEarnings.toFixed(2)}
${yesterdayDate} Miles Driven ${milesDisplay}
${currentDate} Daily rental $${customer.dailyFee.toFixed(2)}
${currentDate} outstanding $${customer.dueYesterday.toFixed(2)}-$${customer.uberEarnings.toFixed(2)}+$${customer.dailyFee.toFixed(2)} = $${customer.balance.toFixed(2)}

Pls Pay $${customer.balance.toFixed(2)} outstanding as of ${currentDate}

Please make the outstanding payments amount, thru any of the following:
🔹 Zelle: ${paymentInfo.zelle}
🔹 Venmo (Business): ${paymentInfo.venmo}
🔹 Cash App: ${paymentInfo.cashApp}
🔹 PayPal: ${paymentInfo.paypal}
📸 Screenshot once payment is made. Thank you!`;
  } else {
    // Template 2 - Customer has credit
    const creditAmount = Math.abs(customer.balance);
    return `Previous outstanding $0.00
${yesterdayDate} Uber earnings $${customer.uberEarnings.toFixed(2)}
${yesterdayDate} Miles Driven ${milesDisplay}
${currentDate} Daily rental $${customer.dailyFee.toFixed(2)}
${currentDate} Balance earnings $${customer.uberEarnings.toFixed(2)}-$${customer.dailyFee.toFixed(2)} = $${creditAmount.toFixed(2)}

The balance will be sent to you by before 2 PM.`;
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackErr) {
      console.error('Failed to copy: ', fallbackErr);
      return false;
    }
  }
}
