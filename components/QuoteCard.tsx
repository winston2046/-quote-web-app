interface Quote {
  id: number;
  text: string;
  author: string;
}

interface QuoteCardProps {
  quote: Quote;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <p className="text-lg text-gray-800 mb-4">{quote.text}</p>
      <p className="text-sm text-gray-600 text-right">- {quote.author}</p>
    </div>
  );
}
