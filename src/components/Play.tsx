import React from "react";
// import { Modal, Button } from "react-bootstrap";
// import { Stats } from "./Stats";
// import { Board } from "./Board";
// import { Abilities, Board as BoardType } from "../types";
// import { Player } from "../types";

const modalText = [
  {
    title: "",
    body: ""
  },
  {
    title: "Where'd you go?!",
    body: `You've discovered that the cloak you're wearing is the legendary
    invisibility cloak! While under your cloak, spaces will appear blue, and
    enemies cannot see you unless you run into them!`
  },
  {
    title: "Who turned on the light?",
    body: `With all this practice, you're able to perform lumos! Now you can
    see twice the distance! Be careful though: your cloak won't work while you're
    casting the lumos spell. Press " + <i className="fa fa-stop-button"/> + " to
    toggle the spell.`
  },
  {
    title: "The Imperious Counter-Curse!",
    body: `You've discovered the Imperius Countercurse! Now all that's left to do
    is to find where the Death Eater is hidden in the castle.`
  }
];

// type PlayProps = {
//   modal: number;
//   abilities: Abilities;
//   player: Player;
//   board: BoardType;
//   setModal: (modal: number) => void;
// };

// export const Play: React.FC<PlayProps> = ({
//   modal,
//   abilities,
//   player,
//   board,
//   setModal
// }) => {
//   const { title, body } = modalText[modal];
//   const setModalZero = () => setModal(0);
//   return (
//     <div>
//       <div className={modal ? "static-modal" : "static-modal modal-hide"}>
//         <Modal.Dialog>
//           <Modal.Header>
//             <Modal.Title>{title}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>{body}</Modal.Body>
//           <Modal.Footer>
//             <Button variant="primary" onClick={setModalZero}>
//               Got It!
//             </Button>
//           </Modal.Footer>
//         </Modal.Dialog>
//       </div>
//       <div>
//         <Stats abilities={abilities} player={player} />
//       </div>
//       <Board board={board} cloak={abilities.cloak} />
//     </div>
//   );
// };
