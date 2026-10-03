import { describe, expect, it } from "vitest";
import { applyChessMove, chooseChessBotMove, createChessBoard, getChessLegalMoves, getChessOutcome, isChessInCheck, type ChessBoard } from "./chess";
describe("chess",()=>{
 it("hard and master avoid sacrificing a queen for a defended pawn",()=>{
   const b:ChessBoard=Array(64).fill(null);
   b[63]={color:"white",type:"king"}; b[59]={color:"white",type:"queen"};
   b[0]={color:"black",type:"king"}; b[3]={color:"black",type:"rook"}; b[35]={color:"black",type:"pawn"};
   expect(chooseChessBotMove(b,"white","normal",()=>0)).toEqual({from:59,to:35});
   for(const level of ["hard","master"] as const) expect(chooseChessBotMove(b,"white",level,()=>0)).not.toEqual({from:59,to:35});
 });
 it("creates a standard board and 20 legal opening moves",()=>{ const b=createChessBoard(); expect(b.filter(Boolean)).toHaveLength(32); expect(getChessLegalMoves(b,"white")).toHaveLength(20); });
 it("prevents moves that leave the king in check",()=>{ const b:ChessBoard=Array(64).fill(null); b[60]={color:"white",type:"king"}; b[52]={color:"white",type:"rook"}; b[4]={color:"black",type:"rook"}; b[0]={color:"black",type:"king"}; expect(isChessInCheck(b,"white")).toBe(false); expect(getChessLegalMoves(b,"white").some(m=>m.from===52&&m.to===51)).toBe(false); });
 it("promotes pawns to queen",()=>{ const b:ChessBoard=Array(64).fill(null); b[60]={color:"white",type:"king"}; b[4]={color:"black",type:"king"}; b[8]={color:"white",type:"pawn"}; const m=getChessLegalMoves(b,"white").find(x=>x.from===8&&x.to===0)!; expect(applyChessMove(b,m)[0]?.type).toBe("queen"); });
 it("detects checkmate",()=>{ const b:ChessBoard=Array(64).fill(null); b[0]={color:"black",type:"king"}; b[9]={color:"white",type:"queen"}; b[18]={color:"white",type:"king"}; expect(getChessOutcome(b,"black")).toBe("checkmate"); });
 it("master bot always returns a legal move",()=>{ const b=createChessBoard(); const m=chooseChessBotMove(b,"black","master",()=>0); expect(m).not.toBeNull(); expect(getChessLegalMoves(b,"black")).toContainEqual(m); });
});
