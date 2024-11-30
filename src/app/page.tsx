'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

type AdventureStage = 'welcome' | 'age' | 'name' | 'drawingPrompt' | 'expandPrompt' | 'generating' | 'coloring' | 'save';

const AgeComplexityMap = {
  '3-4': {
    complexity: 'Simple',
    details: 'Large shapes, thick lines, minimal details',
    maxColors: 5
  },
  '5-6': {
    complexity: 'Moderate',
    details: 'Medium shapes, more defined lines, some simple patterns',
    maxColors: 8
  },
  '7-9': {
    complexity: 'Detailed',
    details: 'Smaller shapes, intricate lines, more complex patterns',
    maxColors: 12
  },
  '10+': {
    complexity: 'Advanced',
    details: 'Highly detailed, complex patterns, fine lines',
    maxColors: 16
  }
};

// Pencil and Crayon SVG Icons
const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
    <path fill="#FFD700" d="M20.71,4.04C21.1,3.65 21.1,3 20.71,2.63L18.37,0.29C18,-0.1 17.35,-0.1 16.96,0.29L15,2.25L18.75,6M17.75,7L14,3.25L4.25,13L3,17L7,15.75L16.75,6" />
  </svg>
);

const CrayonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
    <path fill="#FF6B6B" d="M20.71,4.04C21.1,3.65 21.1,3 20.71,2.63L18.37,0.29C18,-0.1 17.35,-0.1 16.96,0.29L15,2.25L18.75,6M17.75,7L14,3.25L4.25,13L3,17L7,15.75L16.75,6" />
  </svg>
);

type FallingItem = {
  id: number;
  left: number; 
  color: string;
  type: 'pencil' | 'crayon';
  rotationDirection: 1 | -1;
  rotationAmount: number;
};

const FallingItems = () => {
  const [items, setItems] = useState<FallingItem[]>([]);

  useEffect(() => {
    const generateItem = () => {
      const newItem: FallingItem = {
        id: Date.now(),
        left: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        type: Math.random() > 0.5 ? 'pencil' : 'crayon',
        rotationDirection: Math.random() > 0.5 ? 1 : -1,
        rotationAmount: Math.random() * 360
      };
      setItems((prevItems: FallingItem[]) => [...prevItems, newItem]);
    };

    const interval = setInterval(generateItem, 1000);
    const cleanupInterval = setInterval(() => {
      setItems(prevItems => prevItems.filter(item => 
        // Extend well beyond screen height
        item.left < 3000
      ));
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        height: '100vh', 
        width: '100vw'
      }}
    >
      {items.map(item => (
        <div
          key={item.id}
          className="absolute animate-fall-full"
          style={{
            left: `${item.left}px`,
            animationDuration: `${Math.random() * 5 + 3}s`,
            animation: `fall-full ${Math.random() * 5 + 3}s linear forwards, 
                       spin${item.rotationDirection > 0 ? '' : 'Reverse'} ${Math.random() * 3 + 2}s linear infinite`,
            transform: `rotate(${item.rotationAmount}deg)`
          }}
        >
          {item.type === 'pencil' ? (
            <PencilIcon />
          ) : (
            <CrayonIcon />
          )}
        </div>
      ))}
    </div>
  );
};
const DrawingBuddyAdventure = () => {
  const [stage, setStage] = useState<AdventureStage>('welcome');
  const [age, setAge] = useState<keyof typeof AgeComplexityMap>('5-6');
  const [characterName, setCharacterName] = useState('');
  const [drawingPrompt, setDrawingPrompt] = useState('');
  const [additionalFeatures, setAdditionalFeatures] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const adventureStages: Record<AdventureStage, { title: string; content: React.ReactNode }> = {
    welcome: {
      title: "Welcome to Drawing Buddy Adventure! 🌈",
      content: (
        <div className="text-center space-y-4">
          <p className="text-2xl">Are you ready to go on a magical drawing quest?</p>
          <button 
            onClick={() => setStage('age')}
            className="bg-purple-500 text-white px-6 py-3 rounded-full text-xl hover:bg-purple-600 transition"
          >
            Start Adventure! ✨
          </button>
        </div>
      )
    },
    age: {
      title: "Choose Your Age Group! 🎂",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(AgeComplexityMap).map(([ageGroup, details]) => (
              <button
                key={ageGroup}
                onClick={() => {
                  setAge(ageGroup as keyof typeof AgeComplexityMap);
                  setStage('name');
                }}
                className="bg-blue-400 text-white p-4 rounded-lg hover:bg-blue-500 transition"
              >
                <div className="font-bold text-xl">{ageGroup} Years</div>
                <div className="text-sm">{details.complexity} Complexity</div>
                <div className="text-xs mt-2">{details.details}</div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    name: {
      title: "Choose Your Artist Name! 🎨",
      content: (
        <div className="space-y-4">
          <input 
            type="text"
            placeholder="What shall we call you, brave artist?"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            className="w-full p-4 rounded-full text-xl text-center"
          />
          <button 
            onClick={() => characterName ? setStage('drawingPrompt') : null}
            disabled={!characterName}
            className="w-full bg-green-500 text-white px-6 py-3 rounded-full text-xl 
              hover:bg-green-600 transition disabled:opacity-50"
          >
            Continue Adventure! 🚀
          </button>
        </div>
      )
    },
    drawingPrompt: {
      title: `Hello, ${characterName}! What magical world shall we create? 🌟`,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              "Underwater Kingdom 🐠",
              "Space Exploration 🚀", 
              "Magical Forest 🌳", 
              "Dinosaur Land 🦖", 
              "Superhero World 🦸", 
              "Fairy Tale Castle 🏰"
            ].map((theme) => (
              <button
                key={theme}
                onClick={() => {
                  setDrawingPrompt(theme.split(' ')[0]);
                  setStage('expandPrompt');
                }}
                className="bg-blue-400 text-white p-4 rounded-lg hover:bg-blue-500 transition"
              >
                {theme}
              </button>
            ))}
          </div>
          <div className="text-center">
            <p>Or type your own magical world!</p>
            <input 
              type="text"
              placeholder="My magical world is..."
              value={drawingPrompt}
              onChange={(e) => setDrawingPrompt(e.target.value)}
              className="w-full p-4 rounded-full text-xl text-center mt-2"
            />
            <button 
              onClick={() => drawingPrompt && setStage('expandPrompt')}
              disabled={!drawingPrompt}
              className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-full text-xl 
                hover:bg-purple-600 transition disabled:opacity-50"
            >
              Create My World! 🌈
            </button>
          </div>
        </div>
      )
    },
    expandPrompt: {
      title: `Expand Your Magical World: ${drawingPrompt} ✨`,
      content: (
        <div className="space-y-4">
          <p className="text-lg">Add special features or details to your magical world:</p>
          <textarea
            placeholder="For example: Add a rainbow, a treasure chest, or friendly aliens!"
            value={additionalFeatures}
            onChange={(e) => setAdditionalFeatures(e.target.value)}
            className="w-full p-4 rounded-lg text-lg"
          />
          <button 
            onClick={() => setStage('generating')}
            className="w-full bg-green-500 text-white px-6 py-3 rounded-full text-xl hover:bg-green-600 transition"
          >
            Generate My Magical World! 🎉
          </button>
        </div>
      )
    },
    generating: {
      title: `Magical Drawing Time for ${characterName}! ✨`,
      content: (
        <div className="text-center space-y-4">
          <p className="text-2xl">Creating your {drawingPrompt} adventure with {additionalFeatures || "no additional features"}...</p>
          <div className="animate-pulse">
            <img 
              src="/api/placeholder/400/400?text=Generating+Magic" 
              alt="Generating" 
              className="mx-auto rounded-xl"
            />
          </div>
          <button 
            onClick={() => {
              setGeneratedImage(`/api/placeholder/400/400?text=${drawingPrompt}+${encodeURIComponent(additionalFeatures)}`);
              setStage('coloring');
            }}
            className="bg-green-500 text-white px-6 py-3 rounded-full text-xl 
              hover:bg-green-600 transition"
          >
            Reveal My Drawing! 🎉
          </button>
        </div>
      )
    },
    coloring: {
      title: `Color Your ${drawingPrompt} Adventure! 🖍️`,
      content: (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-lg">
              Coloring Guide for {age} Years Old 
              <span className="block text-sm text-gray-600">
                {AgeComplexityMap[age].complexity} Complexity | Max {AgeComplexityMap[age].maxColors} Colors
              </span>
            </p>
          </div>
          <Image 
            src={generatedImage || ''} 
            alt="Your drawing"
            width={400}
            height={400} 
            className="mx-auto rounded-xl"
          />
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => setStage('save')}
              className="bg-blue-500 text-white px-6 py-3 rounded-full text-xl 
                hover:bg-blue-600 transition"
            >
              Save My Masterpiece! 💾
            </button>
            <button 
              onClick={() => {
                // Simulate print functionality
                window.print();
              }}
              className="bg-purple-500 text-white px-6 py-3 rounded-full text-xl 
                hover:bg-purple-600 transition"
            >
              Print Coloring Page! 🖨️
            </button>
          </div>
          <div className="text-center mt-4 p-4 bg-yellow-100 rounded-lg">
            <h3 className="font-bold mb-2">Coloring Tips! 🌈</h3>
            {age === '3-4' && (
              <p>Use big, chunky crayons. Stay inside the lines as best as you can!</p>
            )}
            {age === '5-6' && (
              <p>Try using colored pencils. Practice staying closer to the lines.</p>
            )}
            {age === '7-9' && (
              <p>Experiment with shading and blending colors. Get creative!</p>
            )}
            {age === '10+' && (
              <p>Challenge yourself with advanced coloring techniques like gradient and texture.</p>
            )}
          </div>
        </div>
      )
    },
    save: {
      title: `${characterName}'s Art Gallery 🖼️`,
      content: (
        <div className="space-y-4">
          <p className="text-2xl">Your drawing is saved!</p>
          <div className="grid grid-cols-3 gap-4">
            {[generatedImage, generatedImage, generatedImage].map((img, index) => (
              <div key={index} className="relative">
                <Image
                  src={img || ''}
                  alt={`Artwork ${index + 1}`}
                  width={400}
                  height={400}
                  className="rounded-xl"
                />
                <button 
                  className="absolute bottom-2 right-2 bg-red-500 text-white p-2 rounded-full"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setStage('drawingPrompt')}
            className="w-full bg-green-500 text-white px-6 py-3 rounded-full text-xl 
              hover:bg-green-600 transition"
          >
            Create Another Adventure! 🚀
          </button>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4 relative">
      {/* Add Falling Items Background */}
      <FallingItems />
      
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden relative z-10">
        <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
          <CardTitle className="text-center text-3xl font-bold">
            {adventureStages[stage].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {adventureStages[stage].content}
        </CardContent>
      </Card>
    </div>
  );
};

export default DrawingBuddyAdventure;

