'use client'; // This directive makes the component a Client Component, enabling interactivity

import React, { useState, useEffect, useRef } from 'react';
import { BlindBox_Items } from '../lib/blindBoxItem';

export default function BlindBoxPage() {
    // State for the user's collected blind box items
    const [myItems, setMyItems] = useState([]);
    // State for the number of spin chances available
    const [spinChances, setSpinChances] = useState(0);
    // State for the currently revealed item after a spin
    const [revealedItem, setRevealedItem] = useState(null);
    // State to manage the spinning animation
    const [isSpinning, setIsSpinning] = useState(false);
    // State for error messages related to spinning
    const [spinError, setSpinError] = useState(null);

    // Refs for animation (optional, but good for direct DOM manipulation)
    const spinBoxRef = useRef(null);

    // Local Storage Keys
    const COMPLETED_TASKS_KEY = "completedTaskCount";
    const COLLECTED_ITEMS_KEY = "collectedBlindBoxItems";
    const SPINS_MADE_KEY = "spinsMade"; // To track spins independently of completed tasks

    // --- Data Loading and Persistence ---
    useEffect(() => {
        // Function to handle loading and recalculating spins
        const updateSpinData = () => {
            // Load collected items
            const savedItems = localStorage.getItem(COLLECTED_ITEMS_KEY);
            if (savedItems) {
                setMyItems(JSON.parse(savedItems));
            }

            // Load completed task count to calculate initial spin chances
            const savedCompletedTasks = localStorage.getItem(COMPLETED_TASKS_KEY);
            const completedCount = savedCompletedTasks ? parseInt(savedCompletedTasks, 10) : 0;

            // Load spins made (to prevent getting infinite spins from old completed tasks)
            const savedSpinsMade = localStorage.getItem(SPINS_MADE_KEY);
            const spinsMadeCount = savedSpinsMade ? parseInt(savedSpinsMade, 10) : 0;

            // --- DEBUG LOGS START ---
            console.log("--- BlindBoxPage Debug ---");
            console.log("Completed Tasks (from localStorage):", completedCount);
            console.log("Spins Made (from localStorage):", spinsMadeCount);
            // --- DEBUG LOGS END ---

            // Calculate available spins: 1 spin per 5 completed tasks, minus spins already made
            const calculatedChances = Math.floor(completedCount / 5) - spinsMadeCount;
            setSpinChances(Math.max(0, calculatedChances)); // Ensure chances are not negative

            // --- DEBUG LOGS START ---
            console.log("Calculated Spin Chances:", calculatedChances);
            console.log("Final Spin Chances (after Math.max):", Math.max(0, calculatedChances));
            console.log("--- End Debug ---");
        };

        updateSpinData(); // Initial load when component mounts

        // Listen for localStorage changes from TodoList to update spin chances in real-time
        window.addEventListener('localStorageChange', updateSpinData);

        return () => {
            window.removeEventListener('localStorageChange', updateSpinData);
        };
    }, []); // Run once on mount

    // Effect to save collected items whenever myItems state changes
    useEffect(() => {
        localStorage.setItem(COLLECTED_ITEMS_KEY, JSON.stringify(myItems));
    }, [myItems]);

    // --- Blind Box Spin Logic ---
    const handleSpin = () => {
        if (isSpinning) return; // Prevent multiple spins
        if (spinChances <= 0) {
            setSpinError("You need to complete more tasks to get a spin chance!");
            return;
        }

        setSpinError(null);
        setIsSpinning(true);
        setRevealedItem(null); // Clear previous revealed item

        // Decrement spin chances immediately
        const newSpinChances = spinChances - 1;
        setSpinChances(newSpinChances);

        // Increment spins made count in localStorage
        const currentSpinsMade = parseInt(localStorage.getItem(SPINS_MADE_KEY) || "0", 10);
        const updatedSpinsMade = currentSpinsMade + 1;
        localStorage.setItem(SPINS_MADE_KEY, updatedSpinsMade.toString());
        window.dispatchEvent(new Event('localStorageChange')); // Notify other components if needed

        // Simulate a spinning animation duration
        const spinDuration = 2000; // 2 seconds

        // Apply a subtle animation class
        if (spinBoxRef.current) {
            spinBoxRef.current.classList.add('animate-spin-fast'); // Make sure this class is defined in globals.css
        }

        setTimeout(() => {
            // Choose a random item
            const randomIndex = Math.floor(Math.random() * BlindBox_Items.length);
            const chosenItem = BlindBox_Items[randomIndex];

            setRevealedItem(chosenItem); // Set the revealed item

            // Add the item to collected items
            setMyItems(prevItems => [...prevItems, chosenItem]);

            // Remove animation class
            if (spinBoxRef.current) {
                spinBoxRef.current.classList.remove('animate-spin-fast');
            }

            setIsSpinning(false); // End spinning state
        }, spinDuration);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
            <h1 className="text-3xl font-playfair-display font-bold text-gray-800 mb-4 text-center">Blind Box</h1>
            <p className="text-gray-600 text-center mb-6">Complete tasks to earn spins and collect unique items!</p>

            {/* Spin Chances and Spin Button */}
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow-inner mb-8">
                <p className="text-xl font-semibold text-gray-700 mb-4">
                    Spins Available: <span className="text-blue-600 text-3xl">{spinChances}</span>
                </p>
                <button
                    onClick={handleSpin}
                    disabled={isSpinning || spinChances <= 0}
                    className={`
            px-8 py-3 rounded-full font-bold text-lg shadow-md transition-all duration-300
            ${isSpinning || spinChances <= 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105'}
            focus:outline-none focus:ring-4 focus:ring-purple-300
          `}
                >
                    {isSpinning ? 'Spinning...' : 'Spin for Item!'}
                </button>
                {spinError && (
                    <p className="text-red-500 text-sm mt-3">{spinError}</p>
                )}
            </div>

            {/* Revealed Item Display */}
            <div className="flex flex-col items-center justify-center p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Revealed Item:</h2>
                <div
                    ref={spinBoxRef} // Attach ref for animation
                    className={`
            w-32 h-32 flex items-center justify-center border-4 border-dashed border-gray-300 rounded-xl bg-gray-100
            ${isSpinning ? 'animate-pulse-slow' : ''}
          `}
                >
                    {revealedItem ? (
                        // Render SVG directly using dangerouslySetInnerHTML
                        <div
                            className="w-24 h-24 flex items-center justify-center" // Adjust size as needed
                            dangerouslySetInnerHTML={{ __html: `<img src="${revealedItem.path}" alt="${revealedItem.name}" class="w-full h-full object-contain" />` }}
                        />
                    ) : (
                        <span className="text-gray-400 text-lg">?</span>
                    )}
                </div>
                {revealedItem && (
                    <p className="text-xl font-medium text-gray-700 mt-3">{revealedItem.name}</p>
                )}
            </div>

            {/* My Collected Items Section */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">My Collected Items ({myItems.length})</h2>
                {myItems.length === 0 ? (
                    <p className="text-gray-500 text-center italic">Start spinning to collect items!</p>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                        {myItems.map((item, index) => (
                            <div key={item.id + index} className="flex flex-col items-center p-3 bg-white rounded-lg shadow-md">
                                <div
                                    className="w-16 h-16 flex items-center justify-center" // Adjust size as needed
                                    dangerouslySetInnerHTML={{ __html: `<img src="${item.path}" alt="${item.name}" class="w-full h-full object-contain" />` }}
                                />
                                <p className="text-sm text-gray-700 text-center font-medium">{item.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
