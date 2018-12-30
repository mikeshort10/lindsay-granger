import React, { Component } from 'react';
import './App.css';

//As I level up, my attack changes
//directions for cloak
//directions for lumos
//directions for book
//I can move on to level 2 😱

import {
  Modal,
  Button,
  Panel,
  ProgressBar,
  FormGroup,
  Radio
} from 'react-bootstrap';

function Space(props) {
  let player = props.space.player;
  return (
    <div
      onClick={() =>
        console.log(props.space.player, props.space.row, props.space.column)
      }
      className={
        props.space.darkness
          ? "darkness"
          : !props.space.playable && (player === undefined || player === "door")
            ? "wall"
            : "space"
      }
    >
      <i
        className={
          player === "wand"
            ? "fas fa-scroll wand"
            : player === "potion"
              ? "fas fa-flask potion"
              : player === "boss"
                ? "fas fa-skull boss"
                : player === "door"
                  ? "fas fa-lock door"
                  : player === "book"
                    ? "fas fa-book book"
                    : player ? "fas fa-hat-wizard " + player : ""
        }
      />
    </div>
  );
}

class Board extends Component {

  createBoard() {
    var arr = [];
    for (let row in this.props.board) {
      for (let column in this.props.board[row]) {
        arr.push(
          <Space
            space={this.props.board[row][column]}
            abilities={this.props.abilities}
          />
        );
      }
    }
    return arr;
  }

  render() {
    return (
      <div id={this.props.abilities.cloaked ? "board-cloaked" : "board"}>
        {this.createBoard()}
      </div>
    );
  }
}

function Stats(props) {
  return (
    <Panel id="stats-panel">
      <Panel.Body id="stats">
        {"Level " + props.playerLevel}
        <br />
        <ProgressBar className="black-font">
        XP
        <ProgressBar now={props.playerXP} max={props.playerLevel * 10} key={1} />
        </ProgressBar>
        <ProgressBar className="black-font">
        HP
        <ProgressBar
          bsStyle="success"
          now={props.playerHP}
          max={props.playerMaxHP}
          key={2}
        />
        </ProgressBar>
        <div className="row">
          <i
            className={
              props.abilities.lumosPlus
                ? "far fa-lightbulb col-xs-3"
                : "hide-icon col-xs-3"
            }
          />
          <i
            className={
              props.abilities.hasCloak ? "fas fa-mask col-xs-3" : "hide-icon col-xs-3"
            }
          />
          <i
            className={
              props.abilities.alohomora ? "fas fa-book col-xs-3" : "hide-icon col-xs-3"
            }
          />
        </div>
      </Panel.Body>
    </Panel>
  );
}

/*function Buttons(props) {
  return (
    <div className="buttons">
      <div className="action" onTouchStart={() => props.iconDown(65)}
        onTouchEnd={() => props.iconUp(65)}>
        <i className="far fa-play-circle" />
      </div>
      <div className="lumos" onClick={() => props.toggleLights(32)}>
        <i className="far fa-stop-circle" />
      </div>
      <div
        className="up"
        onTouchStart={() => props.iconDown(38)}
        onTouchEnd={() => props.iconUp(38)}
      >
        <i className="fas fa-chevron-circle-up" />
      </div>
      <div
        className="left"
        onTouchStart={() => props.iconDown(37)}
        onTouchEnd={() => props.iconUp(37)}
      >
        <i className="fas fa-chevron-circle-left" />
      </div>
      <div
        className="right"
        onTouchStart={() => props.iconDown(39)}
        onTouchEnd={() => props.iconUp(39)}
      >
        <i className="fas fa-chevron-circle-right" />
      </div>
      <div
        className="down"
        onTouchStart={() => props.iconDown(40)}
        onTouchEnd={() => props.iconUp(40)}
      >
        <i className="fas fa-chevron-circle-down" />
      </div>
    </div>
  );
}*/

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "begin",
      checkpoints: checkpoints(),
      codeArr: [],
      playerDirection: undefined,
      attacking: false,
      playerLevel: 1,
      playerHP: 30,
      playerMaxHP: 30,
      playerXP: 0,
      abilities: {
        cloaked: false,
        lumosPlus: false,
        elderWand: false,
        lumosToggle: false,
        alohomora: false
      },
      playerAttack: "Stupify",
      numOfEnemies: 12,
      enemyType: "hufflepuff",
      modal: 0,
      modalText: [
        {
          title: "",
          body: ""
        },
        {
          title: "Where'd you go?!",
          body: "You've discovered that the cloak you're wearing is the legendary invisibility cloak! While under your cloak, spaces will appear blue, and enemies cannot see you unless you run into them!"
        },
        {
          title: "Who turned on the light?",
          body: "With all this practice, you're able to perform lumos! Now you can see twice the distance! Be careful though: your cloak won't work while you're casting the lumos spell. Press " + <i className="fa fa-stop-button"/> + " to toggle the spell."
        },
        {
          title: "The Imperious Counter-Curse!",
          body: "You've discovered the Imperius Countercurse! Now all that's left to do is to find where the Death Eater is hidden in the castle."
        }
      ],
      testMode: false,
      noBots: false
    };
    this.move = this.move.bind(this);
    this.win = this.win.bind(this);
    this.lumos = this.lumos.bind(this);
    this.toggleLights = this.toggleLights.bind(this);
    this.generateCheckpoints = this.generateCheckpoints.bind(this);
    this.generateVillian = this.generateVillian.bind(this);
    this.findCheckpoint = this.findCheckpoint.bind(this);
    this.keyup = this.keyup.bind(this);
  }

  lumos(code, board, playerRow, playerCol, lumos) {
    let lumosToggle = this.state.abilities.lumosToggle;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let row = board[playerRow + i];
        let col = playerCol + j;
        row[col].darkness = false;
        if (lumos && lumosToggle) {
          for (let k = -1; k < 2; k++) {
            let kRow = board[playerRow + i + k];
            let kCol = col + k;
            kRow[col].darkness = false;
            row[kCol].darkness = false;
          }
        }
      }
    }

    let hide = !this.state.testMode;
    let d = 2;
    if (lumos && lumosToggle) {
      let plusRow = board[playerRow + 2];
      let minusRow = board[playerRow - 2];
      let plusCol = playerCol + 2;
      let minusCol = playerCol - 2;
      if (plusRow && plusRow[plusCol]) plusRow[plusCol].darkness = hide;
      if (minusRow && minusRow[plusCol]) minusRow[plusCol].darkness = hide;
      if (plusRow && plusRow[minusCol]) plusRow[minusCol].darkness = hide;
      if (minusRow && minusRow[minusCol]) minusRow[minusCol].darkness = hide;
      d = 3;
    }

    let i = 1 - d;
    switch (code) {
      case 37:
        for (i; i < d; i++) {
          if (board[playerRow + i] && board[playerRow + i][playerCol + d])
            board[playerRow + i][playerCol + d].darkness = hide;
        }
        break;
      case 38:
        for (i; i < d; i++) {
          if (board[playerRow + d] && board[playerRow + d][playerCol + i])
            board[playerRow + d][playerCol + i].darkness = hide;
        }
        break;
      case 39:
        for (i; i < d; i++) {
          if (board[playerRow + i] && board[playerRow + i][playerCol - d])
            board[playerRow + i][playerCol - d].darkness = hide;
        }
        break;
      case 40:
        for (i; i < d; i++) {
          if (board[playerRow - d] && board[playerRow - d][playerCol + i])
            board[playerRow - d][playerCol + i].darkness = hide;
        }
        break;
      default:
        break;
    }
    return board;
  }

  determineCheckpoint(player, lastSpace, currentSpace) {
    let lastCheckpoint = player.checkpointCode;
    let coords = player.lastCheckpoint;
    let code = currentSpace.checkpoint;
    let lastDirection = lastSpace.toCenter;
    let currDirection = currentSpace.toCenter;
    if (
      code !== undefined &&
      lastSpace.checkpoint === code &&
      lastDirection !== currDirection
    ) {
      lastCheckpoint =
        lastDirection || code.length === 1 ? code : code.substr(0, code.length - 1);
      coords = this.findCheckpoint(this.state.checkpoints, lastCheckpoint);
    }
    return [coords, lastCheckpoint];
  }

  findCheckpoint(route, str, q) {
    if (str.length === 1) {
      if (q) return route[str].q[0];
      else return route[str].p[0];
    }
    let newRoute = route[str[0]];
    let slicedString = str.substr(1);
    return this.findCheckpoint(newRoute, slicedString, q);
  }

  moveSwitch(code, rowToChange, columnToChange) {
    switch (code) {
      case 37:
        columnToChange--;
        break;
      case 38:
        rowToChange--;
        break;
      case 39:
        columnToChange++;
        break;
      case 40:
        rowToChange++;
        break;
      default:
        console.log("error: code === " + code);
        break;
    }
    return [rowToChange, columnToChange];
  }

  bossMove() {
    let board = Object.assign({}, this.state.board);
    let boss = Object.assign({}, this.state.boss);
    let oldBoss = board[boss.position[0]][boss.position[1]];
    let attack = Math.floor(Math.random() * 4) + boss.baseAttack;
    let row, column, newBoss;
    do {
      row = Math.floor(Math.random() * 7) + 15;
      column = Math.floor(Math.random() * 6) + 44;
      newBoss = board[row][column];
    } while (
      newBoss.playable === false ||
      (row === 15 && column === 44) ||
      newBoss.player
    );
    delete oldBoss.player;
    oldBoss.playable = true;
    newBoss.player = "boss";
    newBoss.playable = false;
    boss.position = [row, column];

    this.setState(
      {
        boss: boss,
        board: board,
        playerHP: this.state.playerHP < attack ? 0 : this.state.playerHP - attack
      },
      this.win
    );
  }

  enemyMove(enemyNum) {
    let board = Object.assign({}, this.state.board);
    let player = Object.assign({}, this.state.player);
    let playerHP = this.state.playerHP + 0;
    let enemies = Object.assign({}, this.state.enemies);
    let enemy = enemies[enemyNum];
    let row = enemy.position[0];
    let column = enemy.position[1];
    let bRow = board[row];
    let testRow, testCol, destination, destinationCode;
    if (!enemy.attack) {
      testRow = row;
      testCol = column;
      let code = Math.floor(Math.random() * 4) + 37;
      let newPosition = this.moveSwitch(code, testRow, testCol);
      if (
        board[newPosition[0]][newPosition[1]].playable &&
        board[newPosition[0]][newPosition[1]].player !== "book"
      ) {
        testRow = newPosition[0];
        testCol = newPosition[1];
      }
    } else {
      let pCC = player.checkpointCode;
      let eCC = enemy.checkpointCode;
      console.log(pCC, eCC)
      if (pCC === eCC) {
        destination = player.position;
        destinationCode = pCC;
      } else {
        let commonCode = "";
        let shortestCode = eCC.length > pCC.length ? pCC.length : eCC.length;
        for (let i = 0; i < shortestCode; i++) {
          commonCode += eCC[i];
          if (pCC[i] !== eCC[i] || eCC[i] === undefined) break;
        }
        destinationCode =
          commonCode.length === eCC.length
            ? pCC.substring(0, eCC.length + 1)
            : eCC.substring(0, eCC.length - 1);
        destination = this.findCheckpoint(this.state.checkpoints, destinationCode);
        if (row === destination[0] && column === destination[1]) {
          enemy.lastCheckpoint = destination;
          enemy.checkpointCode = destinationCode;
          destinationCode =
            commonCode.length === eCC.length
              ? pCC.substring(0, eCC.length + 2)
              : eCC.substring(0, eCC.length - 2);
          if (!destinationCode) destinationCode = pCC[0];
          destination = this.findCheckpoint(this.state.checkpoints, destinationCode);
        }
      }
      //console.log(destination);

      let rDiff = row - destination[0];
      let cDiff = column - destination[1];
      let upDown = rDiff ? rDiff / Math.abs(rDiff) : 0;
      let leftRight = cDiff ? cDiff / Math.abs(cDiff) : 0;
      let newRow = row - upDown;
      let newColumn = column - leftRight;
      testRow = row;
      testCol = column;

      if (Math.abs(rDiff) >= Math.abs(cDiff)) {
        if (board[newRow][column].playable) testRow = newRow;
        else if (!leftRight)
          bRow[column - 1] && bRow[column - 1].playable ? testCol-- : testCol++;
        else if (board[row][newColumn].playable) testCol = newColumn;
      } else {
        if (bRow[newColumn].playable) testCol = newColumn;
        else if (!upDown)
          board[row - 1][column] && board[row - 1][column].playable
            ? testRow--
            : testRow++;
        else if (board[newRow][column].playable) testRow = newRow;
      }
    }

    let formerEnemy = bRow[column];
    let newEnemy = board[testRow][testCol];
    if (newEnemy.player === "wand" || newEnemy.player === "potion")
      this.randomSpace(board, newEnemy.player, 1);
    if (newEnemy.player === "player") {
      if (enemy.attack)
        playerHP -= Math.ceil(Math.random() * 4 + enemy.baseAttack);
      else enemy.attack = true;
    } else {
      delete formerEnemy.player;
      formerEnemy.playable = true;
      newEnemy.player = enemy.player;
      newEnemy.playable = false;
      if (
        !newEnemy.darkness &&
        !this.state.abilities.cloaked &&
        !this.state.testMode
      )
        enemy.attack = true;
      enemy.position = [testRow, testCol];
      if (destination === undefined) {
        let checkpoint = this.determineCheckpoint(enemy, formerEnemy, newEnemy);
        enemy.lastCheckpoint = checkpoint[0];
        enemy.checkpointCode = checkpoint[1];
      }
    }
    this.setState(
      {
        board: board,
        enemies: enemies,
        playerHP: playerHP < 0 ? 0 : playerHP
      },
      this.win
    );
  }

  alohomora(board) {
    delete board[21][44].player;
    board[21][44].playable = true;
    return board;
  }

  move(code) {
    if (typeof code !== "number") code = window.event.keyCode;
    if ((code < 37 || code > 40) && code !== 65) return;
    let board = Object.assign({}, this.state.board);
    let player = Object.assign({}, this.state.player);
    let enemies = Object.assign({}, this.state.enemies);
    let abilities = Object.assign({}, this.state.abilities);
    let timers = Object.assign({}, this.state.timers);
    let boss = Object.assign({}, this.state.boss);
    let XP = this.state.playerXP + 0;
    let HP = this.state.playerHP + 0;
    let playerMaxHP = this.state.playerMaxHP + 0;
    let level = this.state.playerLevel + 0;
    let levelUp = level * 10;
    let modal = 0;
    let newPosition;
    newPosition = this.moveSwitch(
      code !== 65 ? code : this.state.playerDirection,
      player.position[0],
      player.position[1]
    );
    let playerRow = newPosition[0];
    let playerCol = newPosition[1];
    let r = board[playerRow];
    if (
      r[playerCol].player === "hufflepuff" ||
      r[playerCol].player === "ravenclaw" ||
      r[playerCol].player === "slytherin" ||
      r[playerCol].player === "boss"
    ) {
      let key;
      let attack = Math.floor(
        Math.random() * player.randomLimit + player.baseAttack
      );
      for (let k in enemies) {
        let e = enemies[k].position;
        key = k;
        if (e[0] === playerRow && e[1] === playerCol) {
          enemies[key].attack = true;
          break;
        }
      }
      if (code === 65 && this.state.playerDirection && !this.state.attacking) {
        if (r[playerCol].player === "boss") boss.HP -= attack;
        else {
          enemies[key].HP -= attack;
          if (enemies[key].HP <= 0) {
            clearInterval(timers[key]);
            delete r[playerCol].player;
            r[playerCol].playable = true;
            XP += enemies[key].XP;
            let newVillian =
              enemies[key].player === "hufflepuff" ? "ravenclaw" : "slytherin";
            enemies[key] = this.generateVillian(
              this.state.checkpointCodes,
              board,
              newVillian
            );
            timers[key] = setInterval(
              () => this.enemyMove(key),
              enemies[key].moveSpeed
            );
          }
        }
      }
    } else if (code !== 65 && r[playerCol].playable) {
      let lastRow = board[this.state.player.position[0]];
      let lastCol = this.state.player.position[1];
      let lastSpace = lastRow[lastCol];
      let currentSpace = r[playerCol];
      let checkpoint = this.determineCheckpoint(player, lastSpace, currentSpace);
      player.lastCheckpoint = checkpoint[0];
      player.checkpointCode = checkpoint[1];
      delete lastSpace.player;
      if (currentSpace.row === 23 && currentSpace.column === 47) {
        board[23][46].playable = false;
        boss.timer = setInterval(() => this.bossMove(), boss.moveSpeed);
      }
      if (currentSpace.player === "wand") XP += 10;
      else if (currentSpace.player === "potion") {
        HP + 10 > playerMaxHP ? (HP = playerMaxHP) : (HP += 10);
        this.randomSpace(board, currentSpace.player, 1);
      }
      else if (currentSpace.player === "book") {
        modal = 3;
        abilities.alohomora = true;
        board = this.alohomora(board);
      }
      if (levelUp <= XP) {
        level++;
        XP -= levelUp;
        playerMaxHP += 10;
        HP += 10;
        player.baseAttack += 2;
        switch (level) {
          case 3:
            modal = 1;
            abilities.hasCloak = true;
            abilities.cloaked = true;
            break;
          case 5:
            modal = 2;
            abilities.lumosPlus = true;
            break;
          default:
            break;
        }
      }
      currentSpace.darkness = false;
      currentSpace.player = "player";
      board = this.lumos(code, board, playerRow, playerCol, abilities.lumosPlus);
      player.position = [playerRow, playerCol];
    }
    this.setState(
      {
        modal: modal,
        board: board,
        player: player,
        boss: boss,
        enemies: enemies,
        abilities: abilities,
        playerDirection: code !== 65 ? code : this.state.playerDirection,
        attacking: code === 65 ? true : this.state.attacking,
        playerLevel: level,
        playerXP: XP,
        playerHP: HP,
        playerMaxHP: playerMaxHP,
        timers: timers
      },
      this.win
    );
  }

  keyup(code) {
    code = code.keyCode;
    if (code === 65) {
      this.setState({
        attacking: false
      });
    } else if (code > 36 && code < 41) {
      this.setState({
        playerDirection: undefined
      });
    }
  }

  toggleLights(code) {
    if (code.keyCode !== 32 && code !== 32) return;
    let abilities = Object.assign({}, this.state.abilities);
    if (abilities.lumosPlus) {
      //console.log("luminate");
      let board = Object.assign({}, this.state.board);
      let playerRow = this.state.player.position[0];
      let playerCol = this.state.player.position[1];
      abilities.lumosToggle = !abilities.lumosToggle;
      function luminate(row, column) {
        row = board[playerRow + row];
        column = playerCol + column;
        row[column].darkness = !row[column].darkness;
      }
      for (let i = -2; i <= 2; i++) {
        luminate(2, i);
        luminate(i, 2);
        luminate(-2, i);
        luminate(i, -2);
      }
      if (abilities.lumosToggle) abilities.cloaked = false;
      else if (abilities.hasCloak) abilities.cloaked = true;
      this.setState({
        abilities: abilities,
        board: board
      });
    }
  }

  generateCheckpoints(board) {
    function iterateCheckpointArray(key, pQ, toCenter) {
      for (let i = 0; i < pQ.length; i++) {
        let row = pQ[i][0];
        let column = pQ[i][1];
        board[row][column].checkpoint = key.s;
        board[row][column].toCenter = toCenter;
      }
    }

    function recurThruCheckpoints(cp, str) {
      let arr = [];
      str = str || "";
      for (let i = 0; cp[i]; i++) {
        cp[i].s = str + i;
        arr = arr.concat(str + i);
        iterateCheckpointArray(cp[i], cp[i].p, true);
        iterateCheckpointArray(cp[i], cp[i].q, false);
        if (cp[i][0]) arr = arr.concat(recurThruCheckpoints(cp[i], str + i));
      }
      return arr;
    }
    return recurThruCheckpoints(this.state.checkpoints);
  }

  generateVillian(cpCodes, board, villian) {
    do {
      var index = Math.floor(Math.random() * cpCodes.length);
      var code = cpCodes[index];
    } while (code.length < 2 || index === cpCodes.length - 1);
    let position =
      villian === "boss"
        ? [24, 51]
        : this.findCheckpoint(this.state.checkpoints, code, true);
    let row = position[0];
    let column = position[1];
    let HP, XP, baseAttack, moveSpeed;
    board[row][column].player = villian;
    board[row][column].playable = false;
    switch (villian) {
      case "hufflepuff":
        HP = 20;
        XP = 15;
        baseAttack = 6;
        moveSpeed = 1500;
        break;
      case "ravenclaw":
        HP = 30;
        XP = 20;
        baseAttack = 10;
        moveSpeed = 1000;
        break;
      case "slytherin":
        HP = 50;
        XP = 35;
        baseAttack = 15;
        moveSpeed = 500;
        break;
      case "boss":
        HP = 9 * this.state.numOfEnemies;
        XP = 100;
        baseAttack = this.state.numOfEnemies;
        moveSpeed = 2000;
        break;
      default:
        console.log("invalid villian");
        break;
    }
    return {
      position: [row, column],
      attack: false,
      HP: HP,
      XP: XP,
      baseAttack: baseAttack,
      moveSpeed: moveSpeed,
      player: villian,
      lastCheckpoint: [row, column],
      checkpointCode: board[row][column].checkpoint
    };
  }

  randomSpace(board, player, num) {
    for (let i = 0; i < num; i++) {
      do {
        var row = Math.floor(Math.random() * 50);
        var column = Math.floor(Math.random() * 50);
        var space = board[row][column];
      } while (
        !space.playable ||
        space.player ||
        (row > 20 && row < 32) ||
        (column > 20 && column < 32)
      );
      space.player = player;
    }
    return [row, column];
  }

  boardSetup() {
    let board = {};
    let boss;
    for (let i = 0; i < 54; i++) {
      board[i] = {};
      for (let j = 0; j < 54; j++) {
        board[i][j] = {
          row: i,
          column: j,
          playable: true,
          darkness: !this.state.testMode
        };
      }
    }
    board[28][28].player = "player";
    this.lumos(37, board, 28, 28);
    obstacles().forEach((x, i) => {
      obstacles()[i].forEach(y => (board[i][y].playable = false));
    });
    let cpCodes = this.generateCheckpoints(board);
    boss = this.generateVillian(cpCodes, board, "boss");
    board[36][48].player = "book";
    this.randomSpace(board, "wand", 12);
    this.randomSpace(board, "potion", 6);
    board[23][46].player = "door";
    let enemies = {};
    let i = 0;
    for (i; i < this.state.numOfEnemies; i++)
      enemies[i] = this.generateVillian(cpCodes, board, this.state.enemyType);
    this.setState(
      {
        board: board,
        boss,
        checkpointCodes: cpCodes,
        player: {
          position: [28, 28],
          lastCheckpoint: [23, 33],
          checkpointCode: "1",
          baseAttack: 6,
          randomLimit: 4
        },
        enemies: enemies,
        playerLevel: 1,
        playerHP: 30,
        playerMaxHP: 30,
        playerXP: 0,
        abilities: {
          cloaked: false,
          lumosPlus: false,
          elderWand: false,
          lumosToggle: false,
          alohomora: false
        },
        playerAttack: "Stupify"
      },
      () => {
        document.addEventListener("keydown", this.move, false);
        document.addEventListener("keypress", this.toggleLights, false);
        document.addEventListener("keyup", this.keyup, false);
        let timers = {};
        let counter = 0;
        for (let key in this.state.enemies) counter++;
        for (let i = 0; i < counter; i++)
          timers[i] = setInterval(
            () => this.enemyMove(i),
            this.state.enemies[i].moveSpeed
          );
        this.setState({ timers: timers });
      }
    );
  }

  componentDidMount() {
    if (this.state.status === "play") this.boardSetup();
  }

  win() {
    if (this.state.playerHP > 0 && this.state.boss.HP > 0) return;
    let boss = this.state.boss;
    let status;
    if (this.state.playerHP <= 0) {
      status = "lose...";
      for (let key in this.state.timers) clearInterval(this.state.timers[key]);
      if (boss.timer) clearInterval(boss.timer);
    } else if (boss.HP <= 0) {
      status = "win!";
      for (let key in this.state.timers) clearInterval(this.state.timers[key]);
      clearInterval(boss.timer);
    }
    this.setState({
      status: status || this.state.status
    });
  }

  changeStatus(status) {
    console.log(this.state.status + " changed to: " + status);
    this.setState({ status: status }, () => {
      if (status === "play") this.boardSetup();
    });
  }

  iconDown(code) {
    this.move(code);
    this.setState({
      iconDown: setInterval(() => {
        this.move(code);
      }, 100)
    });
  } //

  iconUp(code) {
    this.keyup(code);
    clearInterval(this.state.iconDown);
  }

  iconClick(code) {
    this.move(code);
    this.keyup(code);
  }

  changeState(event, key) {
    let state = Object.assign({}, this.state);
    state[key] = event.target.value;
    this.setState(state);
  }

  render() {
    if (this.state.status === "begin") {
      return (
        <div>
          <Panel className="text-center border-none">
            <Panel.Heading className="header">
              Lindsay Granger<br />and the Imperius Curse
            </Panel.Heading>
            <Panel.Heading className="header-placeholder">
              {" "}
              Lindsay Granger<br />and the Imperius Curse
            </Panel.Heading>
            <Panel.Body>
              It has been over half a century since the Dark Lord's defeat. The Battle
              of Hogwarts left the castle significantly damaged, though not
              irreparably. Slowly, it recovered and even surpassed its former prestige
              and glory through successive headmasters and headmistresses, most notably
              by the greatest, Hermione Granger.
            </Panel.Body>
            <Panel.Body>
              Now, her granddaughter Lindsay is starting her first year at the
              wizarding school. Though she is new to the castle, she is by no means new
              to magic. Inheriting her grandmother's insatiable desire to learn, she
              has read about magic almost continuously since she was young. And when
              she couldn't read, she would listen to Muggle "audiobooks," a non-magic
              tech that her great-grandfather had left her.
            </Panel.Body>
            <Panel.Body>
              Although she has her first classes tomorrow, she cannot sleep. Today has
              been too exciting, walking through the halls of her grandmother's school
              and wearing the Gryffindor robes that she wore all those years ago.
              Having a touch of the infamous Weasley mischievousness, she sneaks out of
              the dorm on her first night to explore.
            </Panel.Body>
            <Panel.Body>
              After making it to the Great Hall, suddenly the lights goes out
              throughout the castle and Lindsay finds herself in total darkness. There
              are screams and cries down the hall, and without even thinking, Lindsay
              rushes to help. Finding a pudgy Hufflepuff stumbling in the hall, she
              asks if he is alright. But the look in his eyes reveals the truth.
              Lindsay has read about it time and again in her books: the Imperious
              Curse! It seems one of the followers of Voldermort's thinking have found
              their way into the castle!
            </Panel.Body>
            <Panel.Body>
              Quickly stunning the Hufflepuff boy, she remembers something her
              grandmother told her. The Defense Against the Dark Arts teacher had just
              developed a counter-curse for the Unforgiveable Curse. She sets out for
              his classroom, in hopes that something there might help her. Though she
              knows more about magic than anyone at the school, she is also
              inexperienced with it. She's not worried though.
            </Panel.Body>
            <Panel.Body>She is grandma's favourite after all...</Panel.Body>
            <Button
              onClick={() => this.changeStatus("instructions")}
              className="start-button"
              bsStyle="success"
              vertical="true"
              block
            >
              Next
            </Button>
          </Panel>
        </div>
      );
    } else if (this.state.status === "instructions") {
      return (
        <div>
          <Panel className="text-center border-none">
            <Panel.Heading className="header">How To Play</Panel.Heading>
            <Panel.Heading className="header-placeholder">H</Panel.Heading>
            <Panel.Body>
              You are at the center of Hogwarts. Without the lights, the castle is a
              maze to a first-year. Setting his victims to curse even more students, the
              Death Eater <i className="fas fa-skull" /> has sealed himself in one of
              the classrooms. Find the counter-curse <i className="fas fa-book book" /> to defeat the Death Eater! 
              </Panel.Body>
              <Panel.Body>
              You may have taken out one Hufflepuff second-year, but
              more talented students may have fallen under the Imperius Curse as
              well. Defeat your schoolmates{" "}
              <i className="fas fa-hat-wizard hufflepuff" />{" "}
              <i className="fas fa-hat-wizard ravenclaw" />{" "}
              <i className="fas fa-hat-wizard slytherin" /> and find scrolls{" "}
              <i className="fas fa-scroll" /> to increase your experience and skills.
              If you do suffer any damage, there may be a few potions{" "}
              <i className="fas fa-flask potion" /> around the castle that can help
              you.
            </Panel.Body>
            <Panel.Body>
              Use the arrow keys to move or use them with "A" to
              attack. Good luck!
            </Panel.Body>
            <Button
              className="start-button"
              onClick={() => this.changeStatus("select")}
              bsStyle="success"
              vertical="true"
              block
            >
              Next
            </Button>
          </Panel>
        </div>
      );
    } else if (this.state.status === "select") {
      return (
        <div>
          <Panel className="start-panel border-none">
            <Panel.Heading className="text-center header">
              Select Your Difficulty
            </Panel.Heading>
            <Panel.Heading className="header-placeholder">S</Panel.Heading>
            <Panel.Body>
              How many students were cursed?
              <FormGroup>
                <Radio
                  name="numOfEnemies"
                  onChange={() => this.changeState("numOfEnemies")}
                  value={6}
                >
                  6
                </Radio>
                <Radio
                  name="numOfEnemies"
                  onChange={() => this.changeState("numOfEnemies")}
                  value={12}
                  checked="checked"
                >
                  12
                </Radio>
                <Radio
                  name="numOfEnemies"
                  onChange={() => this.changeState("numOfEnemies")}
                  value={18}
                >
                  18
                </Radio>
              </FormGroup>
              Which house were they from?
              <FormGroup>
                <Radio
                  name="enemyType"
                  onChange={() => this.changeState("enemyType")}
                  value="hufflepuff"
                  checked="checked"
                >
                  Hufflepuff
                </Radio>
                <Radio
                  name="enemyType"
                  onChange={() => this.changeState("enemyType")}
                  value="ravenclaw"
                >
                  Ravenclaw
                </Radio>
                <Radio
                  name="enemyType"
                  onChange={() => this.changeState("enemyType")}
                  value="slytherin"
                >
                  Slytherin
                </Radio>
              </FormGroup>
            </Panel.Body>
            <Button
              className="start-button"
              onClick={() => this.changeStatus("play")}
              bsStyle="success"
              vertical="true"
              block
            >
              Play
            </Button>
          </Panel>
        </div>
      );
    } else if (this.state.status === "play") {
      return (
        <div>
          <div className={this.state.modal ? "static-modal" : "static-modal modal-hide"}>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>{this.state.modalText[this.state.modal].title}</Modal.Title>
              </Modal.Header>

              <Modal.Body>{this.state.modalText[this.state.modal].body}</Modal.Body>

              <Modal.Footer>
                <Button bsStyle="primary" onClick={() => this.setState({ modal : 0 })}>Got It!</Button>
              </Modal.Footer>
            </Modal.Dialog>
          </div>
          <div>
            <Stats
              abilities={this.state.abilities}
              playerLevel={this.state.playerLevel}
              playerXP={this.state.playerXP}
              playerHP={this.state.playerHP}
              playerAttack={this.state.playerAttack}
              playerMaxHP={this.state.playerMaxHP}
            />
          </div>
          <Board board={this.state.board} abilities={this.state.abilities} />
          {/*<div id="controls">
             <Buttons
              move={x => this.move(x)}
              iconClick={x => this.iconClick(x)}
              iconDown={x => this.iconDown(x)}
              iconUp={x => this.iconUp(x)}
              toggleLights={x => this.toggleLights(x)}
            /> 
          </div>*/}
        </div>
      );
    } else if (this.state.status === "lose...") {
      return (
        <div className="message text-center">
          <Panel id="controls border-none">
            <Panel.Heading>{"You " + this.state.status}</Panel.Heading>
            <Panel.Body>
              <Button bsStyle="primary" onClick={() => this.changeStatus("select")}>
                Replay
              </Button>
            </Panel.Body>
          </Panel>
        </div>
      );
    }
  }
}

//ReactDOM.render(<Game />, document.getElementById("root"));

function obstacles() {
  return [
    [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      52,
      53
    ],
    [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      52,
      53
    ],
    [0, 1, 5, 9, 19, 22, 52, 53],
    [0, 1, 5, 10, 18, 22, 52, 53],
    [
      0,
      1,
      4,
      7,
      10,
      13,
      14,
      15,
      16,
      17,
      21,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      52,
      53
    ],
    [0, 1, 4, 7, 10, 20, 25, 47, 52, 53],
    [0, 1, 7, 11, 12, 13, 14, 16, 17, 18, 19, 25, 36, 38, 48, 52, 53],
    [0, 1, 7, 25, 31, 32, 33, 34, 35, 39, 40, 41, 42, 43, 44, 45, 49, 52, 53],
    [0, 1, 6, 25, 30, 34, 38, 46, 49, 52, 53],
    [0, 1, 6, 7, 8, 9, 15, 16, 17, 18, 25, 29, 33, 37, 47, 50, 52, 53],
    [0, 1, 5, 10, 11, 12, 13, 14, 19, 25, 28, 32, 37, 45, 46, 50, 52, 53],
    [0, 1, 5, 20, 21, 22, 23, 24, 27, 31, 37, 38, 44, 50, 52, 53],
    [0, 1, 5, 24, 27, 31, 39, 43, 50, 52, 53],
    [0, 1, 4, 9, 14, 15, 16, 17, 18, 24, 28, 32, 39, 42, 46, 47, 48, 49, 52, 53],
    [0, 1, 4, 8, 10, 11, 12, 13, 16, 19, 20, 25, 29, 33, 38, 41, 45, 52, 53],
    [0, 1, 4, 8, 15, 21, 25, 29, 33, 37, 40, 45, 52, 53],
    [0, 1, 4, 8, 14, 25, 21, 30, 34, 39, 44, 47, 48, 49, 52, 53],
    [0, 1, 4, 5, 9, 14, 20, 26, 34, 39, 43, 47, 50, 51, 31, 52, 53],
    [0, 1, 6, 9, 14, 20, 27, 31, 35, 38, 42, 46, 52, 53],
    [0, 1, 6, 9, 14, 19, 28, 35, 38, 41, 45, 32, 52, 53],
    [0, 1, 6, 9, 15, 19, 28, 39, 42, 45, 33, 52, 53],
    [0, 1, 6, 9, 15, 19, 28, 36, 39, 43, 46, 52, 53],
    [
      0,
      1,
      5,
      9,
      15,
      19,
      20,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      37,
      38,
      43,
      46,
      52,
      53
    ],
    [0, 1, 5, 10, 15, 18, 21, 43, 46, 52, 53],
    [0, 1, 5, 11, 14, 17, 22, 34, 39, 40, 41, 42, 43, 44, 45, 46, 52, 53],
    [
      0,
      1,
      5,
      10,
      18,
      22,
      27,
      28,
      29,
      34,
      35,
      36,
      37,
      38,
      47,
      48,
      49,
      50,
      51,
      52,
      53
    ],
    [0, 1, 6, 9, 18, 22, 34, 43, 52, 53],
    [0, 1, 7, 9, 10, 11, 19, 22, 25, 31, 34, 43, 52, 53],
    [
      0,
      1,
      7,
      12,
      13,
      15,
      19,
      22,
      25,
      31,
      34,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      52,
      53
    ],
    [0, 1, 8, 11, 16, 22, 25, 31, 34, 45, 46, 47, 51, 52, 53],
    [0, 1, 8, 10, 16, 22, 34, 48, 49, 50, 52, 53],
    [0, 1, 9, 17, 22, 27, 28, 29, 34, 39, 52, 53],
    [0, 1, 2, 3, 4, 5, 9, 12, 18, 19, 20, 21, 22, 34, 40, 41, 42, 43, 52, 53],
    [0, 1, 6, 10, 13, 17, 44, 45, 52, 53],
    [0, 1, 7, 10, 13, 16, 24, 25, 26, 27, 28, 29, 30, 31, 32, 46, 52, 53],
    [0, 1, 3, 7, 12, 16, 30, 35, 47, 48, 49, 52, 53],
    [0, 1, 3, 7, 12, 16, 30, 36, 41, 42, 43, 46, 49, 52, 53],
    [0, 1, 3, 7, 12, 16, 30, 36, 40, 45, 49, 52, 53],
    [0, 1, 4, 7, 11, 15, 18, 22, 23, 24, 30, 36, 40, 44, 49, 52, 53],
    [0, 1, 4, 8, 11, 14, 17, 21, 25, 26, 27, 28, 29, 36, 40, 44, 49, 52, 53],
    [0, 1, 5, 8, 9, 10, 14, 17, 21, 24, 32, 36, 40, 44, 49, 52, 53],
    [0, 1, 5, 14, 17, 20, 24, 33, 36, 40, 45, 50, 52, 53],
    [0, 1, 5, 14, 20, 24, 32, 37, 41, 45, 50, 52, 53],
    [0, 1, 5, 10, 11, 12, 13, 14, 19, 25, 26, 27, 32, 37, 41, 45, 50, 52, 53],
    [0, 1, 5, 6, 7, 8, 9, 19, 27, 32, 37, 41, 45, 49, 52, 53],
    [0, 1, 5, 16, 19, 23, 27, 28, 29, 30, 32, 33, 37, 41, 45, 49, 52, 53],
    [0, 1, 5, 13, 14, 15, 19, 23, 27, 31, 34, 36, 40, 45, 49, 52, 53],
    [0, 1, 5, 10, 11, 12, 19, 23, 27, 32, 35, 39, 45, 49, 52, 53],
    [0, 1, 9, 18, 24, 28, 32, 39, 45, 49, 52, 53],
    [0, 1, 8, 17, 18, 24, 28, 32, 38, 46, 50, 52, 53],
    [0, 1, 7, 8, 16, 22, 23, 24, 28, 33, 34, 35, 36, 37, 47, 52, 53],
    [0, 1, 6, 12, 13, 14, 19, 20, 21, 29, 47, 52, 53],
    [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      52,
      53
    ],
    [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      52,
      53
    ]
  ];
}

function checkpoints() {
  return {
    "0": {
      "0": {
        "0": {
          "0": { p: [[28, 8]], q: [[28, 9]], s: "0000" },
          p: [[12, 7], [12, 6], [12, 8]],
          q: [[13, 7], [13, 6], [13, 8]],
          s: "000"
        },
        p: [[14, 22], [14, 23]],
        q: [[14, 21], [13, 22], [13, 23]],
        s: "00"
      },
      p: [[23, 23]],
      q: [[22, 23], [23, 22]],
      s: "0"
    },
    "1": {
      "0": { p: [[11, 26]], q: [[10, 26]], s: "10" },
      "1": {
        "0": { p: [[13, 30]], q: [[12, 30], [13, 29]], s: "110" },
        "1": { p: [[5, 37]], q: [[5, 36], [6, 37], [5, 38]], s: "111" },
        "2": {
          "0": { p: [[13, 40]], q: [[12, 40], [13, 41]], s: "1120" },
          p: [[16, 38]],
          q: [[15, 38]],
          s: "112"
        },
        p: [[21, 34], [21, 35]],
        q: [[20, 34], [20, 35]],
        s: "11"
      },
      "2": {
        "0": {
          "0": { p: [[9, 48]], q: [[8, 48]], s: "1200" },
          p: [[19, 40]],
          q: [[20, 40]],
          s: "120"
        },
        p: [[23, 39]],
        q: [[22, 39], [23, 40]],
        s: "12"
      },
      p: [[23, 33]],
      q: [[23, 34], [22, 33]],
      s: "1"
    },
    "2": {
      "0": {
        "0": { p: [[25, 43]], q: [[25, 44]], s: "200" },
        p: [[26, 38], [27, 38]],
        q: [[26, 39], [27, 39]],
        s: "20"
      },
      "1": {
        "0": {
          "0": {
            "0": {
              "0": {
                p: [[44, 47], [44, 48], [44, 46]],
                q: [[43, 47], [43, 48], [43, 46]],
                s: "210000"
              },
              p: [[50, 50], [51, 50]],
              q: [[50, 49], [51, 49]],
              s: "21000"
            },
            p: [[43, 51]],
            q: [[44, 51]],
            s: "2100"
          },
          p: [[35, 50], [35, 51]],
          q: [[36, 50], [36, 51]],
          s: "210"
        },
        p: [[30, 39], [29, 39]],
        q: [[30, 40], [29, 40]],
        s: "21"
      },
      "2": {
        "0": { p: [[51, 37]], q: [[51, 36]], s: "220" },
        p: [[36, 44]],
        q: [[37, 44]],
        s: "22"
      },
      "3": {
        "0": { p: [[48, 35], [49, 35]], q: [[48, 34], [49, 34]], s: "230" },
        p: [[38, 38], [38, 37], [38, 39]],
        q: [[39, 38], [39, 37], [39, 39]],
        s: "23"
      },
      "4": { p: [[39, 31]], q: [[39, 30], [40, 31]], s: "24" },
      "5": { p: [[40, 34]], q: [[41, 34], [40, 35]], s: "25" },
      p: [[33, 33]],
      q: [[34, 33], [33, 34], [34, 34]],
      s: "2"
    },
    "3": {
      "0": { p: [[37, 18], [37, 17]], q: [[38, 17]], s: "30" },
      "1": {
        "0": {
          "0": {
            "0": {
              "0": {
                "0": { p: [[51, 25]], q: [[51, 24]], s: "3100000" },
                p: [[43, 23], [44, 23]],
                q: [[43, 24], [44, 24]],
                s: "310000"
              },
              p: [[51, 15]],
              q: [[51, 16]],
              s: "31000"
            },
            p: [[45, 17], [45, 18]],
            q: [[46, 17], [46, 18]],
            s: "3100"
          },
          p: [[42, 18]],
          q: [[42, 17], [43, 18]],
          s: "310"
        },
        "1": {
          "0": {
            "0": {
              "0": {
                "0": {
                  "0": {
                    "0": {
                      "0": {
                        p: [[24, 12], [24, 13]],
                        q: [[23, 12], [23, 13]],
                        s: "3110000000"
                      },
                      "1": { p: [[23, 16]], q: [[22, 16], [23, 17]], s: "3110000001" },
                      "2": {
                        p: [[29, 19], [29, 18]],
                        q: [[30, 19], [30, 18], [29, 20]],
                        s: "3110000002"
                      },
                      p: [[28, 14]],
                      q: [[27, 14]],
                      s: "311000000"
                    },
                    "1": {
                      "0": {
                        p: [[6, 4], [6, 3], [6, 2]],
                        q: [[5, 3], [5, 2]],
                        s: "3110000010"
                      },
                      "1": {
                        "0": {
                          "0": {
                            "0": {
                              "0": {
                                "0": {
                                  p: [[4, 12], [4, 11]],
                                  q: [[3, 12], [3, 11]],
                                  s: "311000001100000"
                                },
                                "1": {
                                  "0": {
                                    "0": {
                                      "0": {
                                        p: [[23, 46]],
                                        q: [[23, 47]],
                                        s: "311000001100001000"
                                      },
                                      p: [[16, 45], [16, 46]],
                                      q: [[17, 45], [17, 46]],
                                      s: "31100000110000100"
                                    },
                                    p: [[9, 51]],
                                    q: [[10, 51]],
                                    s: "3110000011000010"
                                  },
                                  p: [[4, 23]],
                                  q: [[3, 23], [4, 24]],
                                  s: "311000001100001"
                                },
                                p: [[7, 15], [8, 15]],
                                q: [[7, 16], [8, 16], [6, 15]],
                                s: "31100000110000"
                              },
                              p: [[3, 7], [2, 7]],
                              q: [[3, 8], [2, 8]],
                              s: "3110000011000"
                            },
                            p: [[17, 3], [17, 2]],
                            q: [[16, 3], [16, 2]],
                            s: "311000001100"
                          },
                          p: [[25, 4], [25, 3], [25, 2]],
                          q: [[24, 4], [24, 3], [24, 2]],
                          s: "31100000110"
                        },
                        p: [[35, 11], [35, 10]],
                        q: [[36, 11], [36, 10], [35, 9]],
                        s: "3110000011"
                      },
                      p: [[31, 12], [30, 12]],
                      q: [[31, 11], [30, 11]],
                      s: "311000001"
                    },
                    p: [[38, 13]],
                    q: [[37, 13], [38, 14]],
                    s: "31100000"
                  },
                  p: [[40, 7], [40, 6]],
                  q: [[41, 7], [41, 6]],
                  s: "3110000"
                },
                p: [[34, 3], [33, 3]],
                q: [[34, 4], [33, 4]],
                s: "311000"
              },
              p: [[45, 2], [45, 3], [45, 4]],
              q: [[44, 2], [44, 3], [44, 4]],
              s: "31100"
            },
            p: [[48, 5], [49, 5], [50, 5]],
            q: [[48, 4], [49, 4], [50, 4], [51, 5]],
            s: "3110"
          },
          p: [[45, 15], [44, 15]],
          q: [[45, 14], [44, 14]],
          s: "311"
        },
        p: [[38, 19], [38, 20], [38, 21]],
        q: [[39, 19], [39, 20]],
        s: "31"
      },
      p: [[33, 23]],
      q: [[33, 22], [34, 23]],
      s: "3"
    }
  };
}


export default App;
