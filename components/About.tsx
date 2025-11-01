import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/Icons';

const About: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-gray-800/60 rounded-lg border border-gray-700/50 backdrop-blur-sm overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left"
            >
                <h2 className="text-xl font-semibold text-white">About EvoActiv</h2>
                <ChevronDownIcon className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-4 pb-4 text-gray-300 space-y-2">
                    <p>
                        <strong>EvoActiv</strong> is an interactive framework for discovering neural network activation functions using evolutionary algorithms. This simulation visualizes the process of generating, evaluating, and evolving mathematical formulas to find high-performing candidates.
                    </p>
                    <p>
                        The goal is to discover non-trivial functions that combine mathematical operators (like <code>sin</code>, <code>cos</code>), trainable parameters (<code>a</code>, <code>b</code>, <code>c</code>), and the mandatory input variable <code>x</code>. The process mimics natural selection, gradually improving the population of formulas over many generations to find novel activation functions.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;