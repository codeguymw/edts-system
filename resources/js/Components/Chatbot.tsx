import React, { useState } from 'react';

// Hierarchical Knowledge Base for ESCOM Assets
const ASSET_FAQ: any = {
    'Transformers': {
        'Safety Distance': "🚨 Stay at least 10 meters away from any sparking transformer.",
        'Common Issues': "Humming is normal, but loud cracking or oil leaks indicate a major fault.",
        'Reporting': "Note the transformer ID (usually on the pole) before logging."
    },
    'Overhead Lines': {
        'Sagging Lines': "Low-hanging lines are dangerous. Report immediately for tensioning.",
        'Vegetation': "Trees touching lines cause 'earth faults'. Do not trim them yourself!",
        'Broken Wires': "Treat every downed wire as LIVE. Never touch it."
    },
    'Circuit Breakers': {
        'Tripping': "If it trips repeatedly, there is a short circuit in the downstream feed.",
        'Maintenance': "Breakers need periodic testing to ensure they trip during actual faults.",
        'Status Codes': "Green usually means Open/Safe; Red means Closed/Live."
    },
    'Prepaid Meters': {
        'Error Codes': "Error 30 means a tamper event. Contact the Metering department.",
        'Units': "Units are consumed based on kWh. Check your historical usage on the dashboard.",
        'Token Issues': "If a token fails, check if the meter is in 'CIU' communication range."
    }
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Welcome to ESCOM Asset Support. Which asset would you like to know more about?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    
    // Initial options are the top-level categories
    const [quickOptions, setQuickOptions] = useState(Object.keys(ASSET_FAQ));
    const [currentCategory, setCurrentCategory] = useState<string | null>(null);

    const handleSend = (forcedText?: string) => {
        const textToSend = forcedText || input;
        if (!textToSend.trim()) return;

        setMessages((prev) => [...prev, { text: textToSend, isBot: false }]);
        setInput('');

        setTimeout(() => {
            let botText = "";
            let nextOptions: string[] = [];

            // 1. Logic: If the user picked a MAIN Category
            if (ASSET_FAQ[textToSend]) {
                botText = `You are viewing support for ${textToSend}. What specifically do you need help with?`;
                setCurrentCategory(textToSend);
                nextOptions = [...Object.keys(ASSET_FAQ[textToSend]), 'Back to Main Menu'];
            } 
            // 2. Logic: If the user picked a SUB-Question
            else if (currentCategory && ASSET_FAQ[currentCategory][textToSend]) {
                botText = ASSET_FAQ[currentCategory][textToSend];
                nextOptions = [...Object.keys(ASSET_FAQ[currentCategory]), 'Back to Main Menu'];
            }
            // 3. Logic: Back Button
            else if (textToSend === 'Back to Main Menu') {
                botText = "What other asset can I help you with?";
                setCurrentCategory(null);
                nextOptions = Object.keys(ASSET_FAQ);
            }
            // 4. Default Search
            else {
                botText = "I'm not sure about that specific detail. Try selecting one of the categories below.";
                nextOptions = currentCategory ? [...Object.keys(ASSET_FAQ[currentCategory]), 'Back to Main Menu'] : Object.keys(ASSET_FAQ);
            }

            setMessages((prev) => [...prev, { text: botText, isBot: true }]);
            setQuickOptions(nextOptions);
        }, 500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="w-80 h-96 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl flex flex-col border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 bg-[#00853f] text-white flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Asset Support Portal</span>
                            <span className="text-[10px] opacity-80">Knowledge Base v1.0</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">✕</button>
                    </div>
                    
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
                        {messages.map((m, i) => (
                            <div key={i} className={`p-2 rounded-lg text-xs max-w-[85%] ${m.isBot ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 self-start shadow-sm' : 'bg-green-600 text-white self-end'}`}>
                                {m.text}
                            </div>
                        ))}
                    </div>

                    {/* FAQ Quick Replies */}
                    <div className="p-2 border-t dark:border-gray-700 flex flex-wrap gap-1.5 bg-gray-50 dark:bg-gray-900">
                        {quickOptions.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(opt)}
                                className={`text-[10px] px-2.5 py-1 rounded-full transition-all border ${
                                    opt === 'Back to Main Menu' 
                                    ? 'bg-gray-200 text-gray-700 border-gray-300' 
                                    : 'bg-white dark:bg-gray-800 border-[#00853f] text-[#00853f] hover:bg-[#00853f] hover:text-white'
                                }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>

                    {/* Footer Input */}
                    <div className="p-2 border-t dark:border-gray-700 flex gap-2 items-center bg-white dark:bg-gray-800">
                        <input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            className="flex-1 border-none focus:ring-0 text-xs dark:bg-gray-800 dark:text-white"
                            placeholder="Type a question..."
                        />
                        <button onClick={() => handleSend()} className="text-[#00853f] font-bold px-2 text-xs">Send</button>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-[#00853f] rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform"
                >
                    💡
                </button>
            )}
        </div>
    );
}