export type ChessColor = "white" | "black";
export type ChessPieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";
export type ChessPiece = { color: ChessColor; type: ChessPieceType };
export type ChessBoard = Array<ChessPiece | null>;
export type ChessMove = { from: number; to: number; promotion?: "queen" };
export type ChessDifficulty = "easy" | "normal" | "hard" | "master";

const rc = (i:number) => ({ row: Math.floor(i / 8), col: i % 8 });
const idx = (r:number,c:number) => r * 8 + c;
const inside = (r:number,c:number) => r >= 0 && r < 8 && c >= 0 && c < 8;
export const oppositeChessColor = (c:ChessColor):ChessColor => c === "white" ? "black" : "white";

export function createChessBoard(): ChessBoard {
  const board: ChessBoard = Array(64).fill(null);
  const back: ChessPieceType[] = ["rook","knight","bishop","queen","king","bishop","knight","rook"];
  back.forEach((type,col) => {
    board[idx(0,col)] = { color:"black", type };
    board[idx(1,col)] = { color:"black", type:"pawn" };
    board[idx(6,col)] = { color:"white", type:"pawn" };
    board[idx(7,col)] = { color:"white", type };
  });
  return board;
}

function pseudoMoves(board:ChessBoard, from:number, attacksOnly=false):ChessMove[] {
  const piece=board[from]; if(!piece) return [];
  const {row,col}=rc(from); const moves:ChessMove[]=[];
  const add=(r:number,c:number) => {
    if(!inside(r,c)) return false;
    const target=board[idx(r,c)];
    if(!target) { moves.push({from,to:idx(r,c)}); return true; }
    if(target.color!==piece.color) moves.push({from,to:idx(r,c)});
    return false;
  };
  if(piece.type==="pawn"){
    const d=piece.color==="white"?-1:1;
    for(const dc of [-1,1]) {
      const r=row+d,c=col+dc;
      if(inside(r,c) && board[idx(r,c)]?.color===oppositeChessColor(piece.color))
        moves.push({from,to:idx(r,c),...(r===0||r===7?{promotion:"queen" as const}:{})});
      else if(attacksOnly && inside(r,c)) moves.push({from,to:idx(r,c)});
    }
    if(!attacksOnly){
      const one=row+d;
      if(inside(one,col)&&!board[idx(one,col)]){
        moves.push({from,to:idx(one,col),...(one===0||one===7?{promotion:"queen" as const}:{})});
        const start=piece.color==="white"?6:1, two=row+d*2;
        if(row===start&&!board[idx(two,col)]) moves.push({from,to:idx(two,col)});
      }
    }
    return moves;
  }
  if(piece.type==="knight"){
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc])=>add(row+dr,col+dc));
    return moves;
  }
  if(piece.type==="king"){
    for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++) if(dr||dc) add(row+dr,col+dc);
    return moves;
  }
  const dirs = piece.type==="bishop" ? [[-1,-1],[-1,1],[1,-1],[1,1]]
    : piece.type==="rook" ? [[-1,0],[1,0],[0,-1],[0,1]]
    : [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]];
  for(const [dr,dc] of dirs) for(let n=1;n<8;n++) if(!add(row+dr*n,col+dc*n)) break;
  return moves;
}

export function applyChessMove(board:ChessBoard, move:ChessMove):ChessBoard {
  const next=board.map(p=>p?{...p}:null); const piece=next[move.from]; if(!piece) return next;
  next[move.from]=null; next[move.to]={...piece,type:move.promotion??piece.type}; return next;
}

export function isChessSquareAttacked(board:ChessBoard, square:number, by:ChessColor) {
  return board.some((piece,i)=>piece?.color===by && pseudoMoves(board,i,true).some(m=>m.to===square));
}
export function isChessInCheck(board:ChessBoard,color:ChessColor){
  const king=board.findIndex(p=>p?.color===color&&p.type==="king");
  return king>=0 && isChessSquareAttacked(board,king,oppositeChessColor(color));
}
export function getChessLegalMoves(board:ChessBoard,color:ChessColor){
  const moves=board.flatMap((p,i)=>p?.color===color?pseudoMoves(board,i):[]);
  return moves.filter(move=>!isChessInCheck(applyChessMove(board,move),color));
}
export function getChessOutcome(board:ChessBoard,colorToMove:ChessColor):"checkmate"|"stalemate"|null{
  if(getChessLegalMoves(board,colorToMove).length) return null;
  return isChessInCheck(board,colorToMove)?"checkmate":"stalemate";
}
const values:Record<ChessPieceType,number>={pawn:1,knight:3,bishop:3.2,rook:5,queen:9,king:100};
function evaluate(board:ChessBoard,root:ChessColor){
  return board.reduce((s,p)=>!p?s:s+(p.color===root?1:-1)*values[p.type],0);
}
function minimax(board:ChessBoard,turn:ChessColor,root:ChessColor,depth:number):number{
  const outcome=getChessOutcome(board,turn);
  if(outcome==="checkmate") return turn===root?-10000-depth:10000+depth;
  if(outcome==="stalemate") return 0;
  if(depth<=0) return evaluate(board,root);
  const scores=getChessLegalMoves(board,turn).map(m=>minimax(applyChessMove(board,m),oppositeChessColor(turn),root,depth-1));
  return turn===root?Math.max(...scores):Math.min(...scores);
}
export function chooseChessBotMove(board:ChessBoard,color:ChessColor,difficulty:ChessDifficulty,random:()=>number=Math.random):ChessMove|null{
  const moves=getChessLegalMoves(board,color); if(!moves.length) return null;
  if(difficulty==="easy") return moves[Math.floor(random()*moves.length)]??moves[0];
  const depth=difficulty==="master"?2:difficulty==="hard"?1:0;
  const scored=moves.map(move=>{
    const captured=board[move.to]; const next=applyChessMove(board,move);
    const tactical=(captured?values[captured.type]*10:0)+(move.promotion?8:0);
    const look=depth?minimax(next,oppositeChessColor(color),color,depth):evaluate(next,color);
    return {move,score:tactical+look+(difficulty==="normal"?random()*0.5:0)};
  });
  return scored.sort((a,b)=>b.score-a.score)[0].move;
}
