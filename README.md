# Rental Message Generator

A modern web application for processing rental customer data and generating personalized payment messages. Built with React, TypeScript, and Express.js.

## Features

- **Data Processing**: Parse tab-separated customer data from spreadsheets
- **Message Generation**: Automatic creation of personalized payment messages
- **Dynamic Payment Info**: Configurable payment methods (Zelle, Venmo, Cash App, PayPal)
- **Edit Mode**: Modify customer data and dates before generating messages
- **Completion Tracking**: Mark customers as completed with visual indicators
- **Search Functionality**: Filter customers by name
- **Copy to Clipboard**: One-click message copying

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Express.js, Node.js
- **UI Framework**: shadcn/ui with Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Replit

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL (optional, falls back to in-memory storage)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rental-message-generator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Optional: PostgreSQL database URL
DATABASE_URL=your_postgres_connection_string
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Usage

### Data Input

1. **Configure Payment Information**: Set your Zelle, Venmo, Cash App, and PayPal details
2. **Paste Customer Data**: Copy tab-separated data from your spreadsheet into the textarea
3. **Parse Data**: Click "Parse Data" to process the customer information

### Data Format

The application expects tab-separated data with the following columns:
```
Renter Name    Due Yesterday    Uber Earnings    Daily Fee    Balance
```

### Message Generation

1. **Review Data**: Check the parsed customer records and add miles driven
2. **Generate Messages**: Click "Generate Messages" to create personalized messages
3. **Edit if Needed**: Use the edit mode to modify amounts or dates
4. **Copy Messages**: Click copy to send messages to customers
5. **Track Progress**: Mark customers as completed using checkboxes

### Search and Filter

Use the search bar to quickly find specific customers by name. The search works in real-time and maintains all functionality.

## Message Templates

The application generates two types of messages:

### Payment Due Template (Positive Balance)
```
Previous outstanding $X.XX
06/19 Uber earnings $X.XX
06/19 Miles Driven X
06/20 Daily rental $X.XX
06/20 outstanding calculation = $X.XX

Please make the outstanding payments amount, through any of the following:
🔹 Zelle: your@email.com
🔹 Venmo (Business): @username
🔹 Cash App: $username
🔹 PayPal: your@email.com
📸 Screenshot once payment is made. Thank you!
```

### Credit Balance Template (Negative Balance)
```
Previous outstanding $0.00
06/19 Uber earnings $X.XX
06/19 Miles Driven X
06/20 Daily rental $X.XX
06/20 Balance earnings calculation = $X.XX

The balance will be sent to you by before 2 PM.
```

## Development

### Project Structure

```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Application pages
│   │   ├── lib/         # Utilities and configuration
│   │   └── hooks/       # Custom React hooks
├── server/           # Express backend
├── shared/           # Shared types and schemas
└── components.json   # shadcn/ui configuration
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact [your-email@example.com] or create an issue in this repository.