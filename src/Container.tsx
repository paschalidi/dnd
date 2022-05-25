import type {FC} from "react";
import {memo, useCallback, useState} from "react";

import {Card} from "./Card";
import {ItemTypes} from "../src/ItemTypes";

export interface ContainerState {
  cards: any[];
}

type Item = {
  id: number;
  text: string;
};

const ITEMS = [
  {
    id: 1,
    text: "Write a cool JS library",
  },
  {
    id: 2,
    text: "Make it generic enough",
  },
  {
    id: 3,
    text: "Write README",
  },
  {
    id: 4,
    text: "Create some examples",
  },
  {
    id: 5,
    text: "Spam in Twitter and IRC to promote it",
  },
  {
    id: 6,
    text: "???",
  },
  {
    id: 7,
    text: "PROFIT",
  },
];
const LOWER_ITEMS = [
  {
    id: 1,
    text: "my bitch",
  },
  {
    id: 6,
    text: "i live long and happy",
  },

  {
    id: 2,
    text: "is dancing like",
  },
  {
    id: 3,
    text: "an old monkey",
  },
  {
    id: 4,
    text: "with",
  },
  {
    id: 5,
    text: "my old freaking grandpa",
  },
  {
    id: 6,
    text: "yolo friends",
  },
];

export const Container: FC = memo(function Container() {
  const [upperCards, setUpperCards] = useState<Array<Item>>(ITEMS);

  const [lowerCards, setLowerCards] = useState<Array<Item>>(LOWER_ITEMS);

  const findCard = useCallback(
    (id: number, type: string) => {
      let card;
      let position;
      if (type === ItemTypes.UPPER_CARD) {
        card = upperCards.filter((c) => c.id === id)[0];
        position = upperCards.indexOf(card);
      } else {
        card = lowerCards.filter((c) => c.id === id)[0];
        position = lowerCards.indexOf(card);
      }

      return {
        card,
        index: position,
      };
    },
    [upperCards, lowerCards]
  );

  const moveCard = useCallback(
    (
      id: number,
      originalPosition: number,
      moveIntoType: string,
      card: { id: number; text: string }
    ) => {
      if (moveIntoType === ItemTypes.UPPER_CARD) {
        setLowerCards([...lowerCards, card]);
        setUpperCards((upperCards) =>
          upperCards.filter(({ id: idx }) => idx !== card.id)
        );
      }
      if (moveIntoType === ItemTypes.LOWER_CARD) {
        setUpperCards([...upperCards, card]);
        setLowerCards((lowerCards) =>
          lowerCards.filter(({ id: idx }) => idx !== card.id)
        );
      }
    },
    [upperCards, setUpperCards, setLowerCards, lowerCards]
  );

  return (
    <>
      {upperCards.map((card) => (
        <Card
          cardType={ItemTypes.UPPER_CARD}
          key={card.id}
          id={card.id}
          text={card.text}
          moveCard={moveCard}
          findCard={findCard}
        />
      ))}
      <div style={{ border: "solid 1px", height: "35px", marginTop: "50px" }}>
        {lowerCards.map((card) => (
          <Card
            cardType={ItemTypes.LOWER_CARD}
            key={card.id}
            id={card.id}
            text={card.text}
            moveCard={moveCard}
            findCard={findCard}
          />
        ))}
      </div>
    </>
  );
});
