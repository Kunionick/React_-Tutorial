import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    //課題⑤変更・追加
    <button className={`square ${props.isHighlight ? 'highlight' : ''}`} onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, isHighlight = false) {
    //課題⑤変更
    //課題⑤変更・追加
    return <Square isHighlight={isHighlight} key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }
  //課題③Boardをloopを2回使用に変更
  render() {
    return (
      <div>
        {Array(3)
          .fill(0)
          .map((row, i) => {
            return (
              <div className="board-row" key={i}>
                {Array(3)
                  .fill(0)
                  .map((col, j) => {
                    return this.renderSquare(i * 3 + j, this.props.highlightCells.indexOf(i * 3 + j) !== -1); //課題⑤追加
                  })}
              </div>
            );
          })}
      </div>
    );
  }
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      // 課題④追加
      isAsc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
          col: Math.floor(i / 3) + 1, //課題①(col,row)表示
          row: (i % 3) + 1, //課題①(col,row)表示
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  //課題④遷移リストの昇順・降順
  toggleAsc() {
    this.setState({
      asc: !this.state.asc,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const settlement = calculateWinner(current.squares); ////課題⑤勝利につながった 3 つのマス目をハイライト

    //課題⑤変更
    let status;
    if (settlement) {
      //課題⑥追加
      if (settlement.isDraw) {
        status = 'Draw';
      }else {
        status = 'Winner: ' + settlement.winner; //変更
      }
      //課題⑥追加_ここまで
    } else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step, move) => {
      const desc = move ? 'Move #' + move + '(' + step.col + ',' + step.row + ')' : 'Game Start'; //課題①(col,row)表示
      return (
        <li key={move}>
          {/* 課題②着手履歴リスト内で現在選択されているアイテムを太字表示。CSS編集有 */}
          <button onClick={() => this.jumpTo(move)} className={this.state.stepNumber === move ? 'bold' : ''}>
            {desc}
          </button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            highlightCells={settlement ? settlement.line : []} //課題⑤追加
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          {/* 課題④遷移リストの昇順・降順 */}
          <div>
            <button onClick={() => this.toggleAsc()}>ASC ⇔ DESC</button>
          </div>
          <ol>{this.state.asc ? moves : moves.reverse()}</ol>
          {/* <ol>{moves}</ol> */}
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        isDraw: false, //課題⑥引き分け時draw表示
        winner: squares[a], //課題⑤勝利につながった 3 つのマス目をハイライト
        line: [a, b, c], //課題⑤勝利につながった 3 つのマス目をハイライト
      };
    }
  }
  //課題⑥追加
  if (squares.filter((e) => !e).length === 0) {
    return {
      isDraw: true,
      winner: null,
      line: [],
    };
  }

  return null;
}
