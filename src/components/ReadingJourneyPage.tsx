import React, { useState, useEffect, useMemo } from 'react';
import { Route } from '../hooks/useRouter';
import { useLibrary } from '../context/LibraryContext';
import { BookCover } from './BookCover';
import { ReadingStatus } from '../types/book';
import { BookOpen, Target, TrendingUp, Clock, Flame, ChevronRight, Sparkles } from 'lucide-react';

interface P { onNavigate:(r:Route)=>void; onSelectBook:(id:string)=>void; onStartReading:(id:string)=>void; }
const SL:Record<ReadingStatus,string>={'want-to-read':'Want to Read','currently-reading':'Reading Now',completed:'Completed'};
const SC:Record<ReadingStatus,string>={'want-to-read':'bg-stone-400','currently-reading':'bg-amber-500',completed:'bg-emerald-500'};

export const ReadingJourneyPage:React.FC<P>=({onNavigate,onSelectBook,onStartReading})=>{
 const {books,readingProgress,favoriteBooks,getReadingStatus}=useLibrary();
 const [goal,setGoal]=useState<number>(()=>{try{const r=localStorage.getItem('athenaeum_reading_goal');return r?Math.max(1,Number(r)):4;}catch{return 4;}});
 useEffect(()=>{try{localStorage.setItem('athenaeum_reading_goal',String(goal));}catch{}},[goal]);
 const entries=useMemo(()=>Object.values(readingProgress),[readingProgress]);
 const counts=useMemo(()=>{const c:Record<ReadingStatus,number>={'want-to-read':0,'currently-reading':0,completed:0};entries.forEach(p=>{c[p.status]+=1;});return c;},[entries]);
 const pagesRead=useMemo(()=>entries.reduce((s,p)=>s+(p.currentPage||0),0),[entries]);
 const totalPages=useMemo(()=>books.reduce((s,b)=>s+b.pages,0),[books]);
 const avg=useMemo(()=>{if(!entries.length)return 0;const t=entries.reduce((s,p)=>s+Math.min(1,p.totalPages>0?p.currentPage/p.totalPages:0),0);return Math.round(t/entries.length*100);},[entries]);
 const days=useMemo(()=>new Set(entries.map(p=>p.lastReadDate).filter(Boolean)).size,[entries]);
 const completed=useMemo(()=>entries.filter(p=>p.status==='completed').map(p=>books.find(b=>b.id===p.bookId)).filter(Boolean) as typeof books,[entries,books]);
 const reading=useMemo(()=>entries.filter(p=>p.status==='currently-reading').map(p=>({p,book:books.find(b=>b.id===p.bookId)})).filter(x=>x.book) as any[],[entries,books]);
 const recommended=useMemo(()=>{const cats=new Set(completed.map(b=>b.category));const cands=books.filter(b=>getReadingStatus(b.id)!=='completed');const scored=cands.map(b=>({b,s:(b.rating*10)+(cats.has(b.category)?25:0)+(b.featured?10:0)}));scored.sort((a,b)=>b.s-a.s);return scored.slice(0,6).map(x=>x.b);},[books,completed,getReadingStatus]);
 const gp=Math.min(100,Math.round(counts.completed/goal*100));
 return (
  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
   <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
    <div>
     <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">Reading Journey</h1>
     <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">Track progress, set goals, discover your next read.</p>
    </div>
    <div className="flex items-center gap-2">
     <label className="text-xs font-mono uppercase tracking-wider text-stone-500">Monthly Goal</label>
     <input type="number" min={1} max={50} value={goal} onChange={e=>setGoal(Math.max(1,Number(e.target.value)||1))} className="w-16 px-2 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-500/40"/>
     <span className="text-xs text-stone-500">books</span>
    </div>
   </div>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
   <div className="bg-white dark:bg-[#15161c] p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs"><div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400"><BookOpen className="w-3.5 h-3.5"/>In Library</div><p className="font-serif text-3xl font-bold mt-2">{books.length}</p></div>
   <div className="bg-white dark:bg-[#15161c] p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs"><div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400"><TrendingUp className="w-3.5 h-3.5"/>Completed</div><p className="font-serif text-3xl font-bold mt-2">{counts.completed}</p><p className="text-xs text-stone-500 mt-1">{gp}% of goal</p></div>
   <div className="bg-white dark:bg-[#15161c] p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs"><div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400"><Clock className="w-3.5 h-3.5"/>Pages Read</div><p className="font-serif text-3xl font-bold mt-2">{pagesRead.toLocaleString()}</p><p className="text-xs text-stone-500 mt-1">of {totalPages.toLocaleString()}</p></div>
   <div className="bg-white dark:bg-[#15161c] p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs"><div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400"><Flame className="w-3.5 h-3.5"/>Active Days</div><p className="font-serif text-3xl font-bold mt-2">{days}</p><p className="text-xs text-stone-500 mt-1">Avg {avg}%</p></div>
  </div>
  <div className="bg-white dark:bg-[#15161c] p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs space-y-3">
   <div className="flex items-center justify-between"><h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2"><Target className="w-5 h-5 text-amber-600 dark:text-amber-400"/>Monthly Goal</h2><span className="text-sm font-mono text-stone-500">{counts.completed}/{goal}</span></div>
   <div className="w-full bg-stone-100 dark:bg-stone-800 h-3 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-500 to-amber-700 rounded-full transition-all duration-500" style={{width:`${gp}%`}}/></div>
   <p className="text-xs text-stone-500">{gp>=100?'Goal reached — congratulations!':`${goal-counts.completed} more to reach your goal.`}</p>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{(Object.keys(SL) as ReadingStatus[]).map(s=>(<div key={s} className="bg-white dark:bg-[#15161c] p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs"><div className="flex items-center gap-2 mb-2"><span className={`w-2.5 h-2.5 rounded-full ${SC[s]}`}/><span className="text-sm font-medium text-stone-700 dark:text-stone-300">{SL[s]}</span></div><p className="font-serif text-2xl font-bold">{counts[s]}</p></div>))}</div>
 {reading.length>0 && (<section className="space-y-4"><h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">Currently Reading</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{reading.map(({p,book}:any)=>{const pct=p.totalPages>0?Math.round(p.currentPage/p.totalPages*100):0;return(<div key={book.id} className="flex gap-4 bg-white dark:bg-[#15161c] p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs"><div className="w-16 shrink-0"><BookCover coverImage={book.coverImage} title={book.title} author={book.author} category={book.category} className="w-full h-full"/></div><div className="flex-1 min-w-0 space-y-2"><button onClick={()=>onSelectBook(book.id)} className="text-left font-serif font-bold text-stone-900 dark:text-stone-100 hover:text-amber-700 dark:hover:text-amber-400 transition-colors line-clamp-1">{book.title}</button><p className="text-xs text-stone-500">{book.author}</p><div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full transition-all" style={{width:`${pct}%`}}/></div><div className="flex items-center justify-between text-xs text-stone-500"><span>{p.currentPage}/{p.totalPages} pp ({pct}%)</span><button onClick={()=>onStartReading(book.id)} className="text-amber-700 dark:text-amber-400 font-medium hover:underline">Continue</button></div></div></div>);})}</div></section>)}
 <section className="space-y-4">
  <div className="flex items-center justify-between"><h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400"/>Smart Picks</h2><button onClick={()=>onNavigate({name:'explore'})} className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 font-medium flex items-center gap-1">Explore all <ChevronRight className="w-3.5 h-3.5"/></button></div>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">{recommended.map(book=>(<button key={book.id} onClick={()=>onSelectBook(book.id)} className="group text-left space-y-2"><div className="aspect-[2/3] rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow"><BookCover coverImage={book.coverImage} title={book.title} author={book.author} category={book.category} className="w-full h-full"/></div><p className="text-xs font-medium text-stone-800 dark:text-stone-200 line-clamp-2 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">{book.title}</p></button>))}</div>
 </section>
 {favoriteBooks.length>0 && (<section className="bg-white dark:bg-[#15161c] p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">Your Bookshelf</h3><p className="text-sm text-stone-500 mt-0.5">{favoriteBooks.length} saved volume{favoriteBooks.length===1?'':'s'} waiting.</p></div><button onClick={()=>onNavigate({name:'favorites'})} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-900 text-sm font-medium transition-colors">Open Bookshelf</button></section>)}
 </div>
 );
};

