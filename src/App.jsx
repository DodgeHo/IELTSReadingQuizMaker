import React, { useState } from 'react';
import EditorPanel from './components/EditorPanel';
import QuestionPanel from './components/QuestionPanel';
import ExportButton from './components/ExportButton';
import './style.css';

function App() {
  const [title, setTitle] = useState('');
  const [readingText, setReadingText] = useState('');
  const [questions, setQuestions] = useState([
    { id: 1, type: 'single', text: 'Soccer is played in the street and in youth teams. Which is more organized?', options: ['Street', 'Youth team'], answer: 1 }
  ]);
  const [newQText, setNewQText] = useState('');
  const [newQOptions, setNewQOptions] = useState('');
  const [newQAnswer, setNewQAnswer] = useState('0');

  return (
    <div className="shell">
      <EditorPanel
        title={title}
        setTitle={setTitle}
        readingText={readingText}
        setReadingText={setReadingText}
      />
      <div id="divider" title="Drag to resize"></div>
      <QuestionPanel
        questions={questions}
        setQuestions={setQuestions}
        newQText={newQText}
        setNewQText={setNewQText}
        newQOptions={newQOptions}
        setNewQOptions={setNewQOptions}
        newQAnswer={newQAnswer}
        setNewQAnswer={setNewQAnswer}
      />
      <div style={{position:'fixed',right:32,bottom:32,zIndex:1000}}>
        <ExportButton title={title} readingText={readingText} questions={questions} />
      </div>
    </div>
  );
}

export default App;
