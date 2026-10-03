import { Bot, Crown, RotateCcw, Swords, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { applyChessMove, chooseChessBotMove, createChessBoard, getChessLegalMoves, getChessOutcome, isChessInCheck, oppositeChessColor, type ChessColor, type ChessDifficulty, type ChessMove, type ChessPieceType } from "@/features/portfolio/utils/chess";
type Mode="bot"|"local";
const glyph:Record<ChessColor,Record<ChessPieceType,string>>={white:{king:"♔",queen:"♕",rook:"♖",bishop:"♗",knight:"♘",pawn:"♙"},black:{king:"♚",queen:"♛",rook:"♜",bishop:"♝",knight:"♞",pawn:"♟"}};
const labels:Record<ChessDifficulty,string>={easy:"fácil",normal:"normal",hard:"difícil",master:"mestre"};
export default function PortfolioChess(){
 const [mode,setMode]=useState<Mode>("bot"),[difficulty,setDifficulty]=useState<ChessDifficulty>("normal");
 const [board,setBoard]=useState(createChessBoard),[turn,setTurn]=useState<ChessColor>("white"),[selected,setSelected]=useState<number|null>(null);
 const legal=useMemo(()=>getChessLegalMoves(board,turn),[board,turn]);
 const outcome=getChessOutcome(board,turn);
 const restart=()=>{setBoard(createChessBoard());setTurn("white");setSelected(null);};
 const commit=(move:ChessMove)=>{const next=applyChessMove(board,move);setBoard(next);setSelected(null);setTurn(oppositeChessColor(turn));};
 const click=(i:number)=>{if(outcome||(mode==="bot"&&turn==="black"))return; const p=board[i]; if(p?.color===turn){setSelected(i);return;} const m=legal.find(x=>x.from===selected&&x.to===i);if(m)commit(m);};
 useEffect(()=>{if(mode!=="bot"||turn!=="black"||outcome)return; const t=window.setTimeout(()=>{const m=chooseChessBotMove(board,"black",difficulty);if(m)commit(m);},difficulty==="master"?520:360);return()=>clearTimeout(t);},[board,difficulty,mode,outcome,turn]);
 const selectedMoves=selected===null?[]:legal.filter(m=>m.from===selected).map(m=>m.to);
 const status=outcome==="checkmate"?(turn==="white"?(mode==="bot"?"PG Bot venceu por xeque-mate.":"Pretas venceram por xeque-mate."):"Brancas venceram por xeque-mate."):outcome==="stalemate"?"Empate por afogamento.":`${turn==="white"?(mode==="bot"?"Sua vez":"Vez das brancas"):(mode==="bot"?"PG Bot pensando":"Vez das pretas")}${isChessInCheck(board,turn)?" · xeque!":""}`;
 const option=(on:boolean)=>`min-h-11 rounded-[10px] border px-3 font-mono text-[9px] uppercase tracking-[.08em] ${on?"border-cyan-300 bg-[#0b2746] text-white":"border-white/10 text-[#9db5c8]"}`;
 return <section data-chess-game="true" aria-labelledby="chess-title" className="border-y border-white/[.07] bg-[#06111e]">
  <div className="mx-auto grid max-w-[1180px] gap-7 px-4 py-9 sm:px-8 lg:grid-cols-[.7fr_1.3fr] lg:px-12">
   <div><p className="font-mono text-[9px] uppercase tracking-[.15em] text-cyan-300">PG Arcade · xadrez</p><h2 id="chess-title" className="mt-3 font-display text-[clamp(2.3rem,10vw,4.2rem)] leading-[.92] text-white">Xadrez.<br/>Pense à frente.</h2>
    <p className="mt-4 text-sm leading-6 text-[#a8c4d7]">Partida completa com xeque, xeque-mate, promoção automática, 1×1 local e quatro níveis de bot.</p>
    <div className="mt-5 flex flex-wrap gap-2"><button data-chess-mode="bot" aria-pressed={mode==="bot"} onClick={()=>{setMode("bot");restart();}} className={option(mode==="bot")}><Bot className="mr-2 inline h-4 w-4"/>vs PG Bot</button><button data-chess-mode="local" aria-pressed={mode==="local"} onClick={()=>{setMode("local");restart();}} className={option(mode==="local")}><UsersRound className="mr-2 inline h-4 w-4"/>1 × 1 local</button></div>
    {mode==="bot"&&<div className="mt-3 flex flex-wrap gap-2">{(["easy","normal","hard","master"] as ChessDifficulty[]).map(d=><button key={d} aria-pressed={difficulty===d} onClick={()=>{setDifficulty(d);restart();}} className={option(difficulty===d)}>{d==="master"&&<Crown className="mr-1 inline h-3 w-3"/>}{labels[d]}</button>)}</div>}
    <p role="status" className="mt-5 min-h-6 text-sm font-medium text-cyan-100">{status}</p><button onClick={restart} className="mt-3 min-h-11 rounded-[10px] border border-white/15 px-4 text-sm text-white"><RotateCcw className="mr-2 inline h-4 w-4"/>nova partida</button>
   </div>
   <div className="mx-auto w-full max-w-[620px]"><div data-chess-board="true" role="grid" aria-label="Tabuleiro de xadrez" className="grid aspect-square grid-cols-8 overflow-hidden rounded-[18px] border border-white/15 shadow-2xl">
    {board.map((piece,i)=>{const {row,col}={row:Math.floor(i/8),col:i%8};const active=selected===i,target=selectedMoves.includes(i);return <button key={i} role="gridcell" aria-label={piece?`${piece.color==="white"?"branca":"preta"} ${piece.type}`:`casa ${i+1}`} onClick={()=>click(i)} className={`relative grid min-h-0 place-items-center text-[clamp(1.35rem,7vw,3rem)] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 ${(row+col)%2?"bg-[#31506a]":"bg-[#d7e3e8]"} ${active?"ring-4 ring-inset ring-cyan-300":""}`}><span className={piece?.color==="white"?"text-white drop-shadow-[0_2px_2px_#10263a]":"text-[#07111d]"}>{piece?glyph[piece.color][piece.type]:""}</span>{target&&<span aria-hidden className="absolute h-3 w-3 rounded-full bg-cyan-300/80"/>}</button>})}
   </div><p className="mt-3 flex items-center gap-2 text-xs text-[#8fa8bd]"><Swords className="h-4 w-4"/>Selecione uma peça; os destinos legais são marcados no tabuleiro.</p></div>
  </div>
 </section>;
}
