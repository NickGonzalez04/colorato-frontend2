'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DrawingBuddyAdventure = () => {
  const [stage, setStage] = useState('welcome');
  const [characterName, setCharacterName] = useState('');
  const [drawingPrompt, setDrawingPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Rest of your component code remains the same...
  const adventureStages = {
    welcome: {
      title: "Welcome to Drawing Buddy Adventure! 🌈",
      content: (
        <div className="text-center space-y-4">
          <p className="text-2xl">Are you ready to go on a magical drawing quest?</p>
          <button 
            onClick={() => setStage('name')}
            className="bg-purple-500 text-white px-6 py-3 rounded-full text-xl hover:bg-purple-600 transition"
          >
            Start Adventure! ✨
          </button>
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
                  setStage('generating');
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
              onClick={() => drawingPrompt && setStage('generating')}
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
    generating: {
      title: `Magical Drawing Time for ${characterName}! ✨`,
      content: (
        <div className="text-center space-y-4">
          <p className="text-2xl">Creating your {drawingPrompt} adventure...</p>
          <div className="animate-pulse">
            <img 
              src="/api/placeholder/400/400?text=Generating+Magic" 
              alt="Generating" 
              className="mx-auto rounded-xl"
            />
          </div>
          <button 
            onClick={() => {
              setGeneratedImage(`/api/placeholder/400/400?text=${drawingPrompt}`);
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
          <img 
            src={generatedImage} 
            alt="Your drawing" 
            className="mx-auto max-w-full rounded-xl"
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
              Print to Color! 🖨️
            </button>
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
                <img 
                  src={img} 
                  alt={`Artwork ${index + 1}`}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
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
