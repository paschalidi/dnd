import type {CSSProperties, FC} from "react";
import {memo} from "react";
import {useDrag, useDrop} from "react-dnd";
import {ItemTypes} from "../src/ItemTypes";

const style: CSSProperties = {
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move",
};

export interface CardProps {
  cardType: string;
  id: number;
  text: string;
  moveCard: (
    id: number,
    to: number,
    type: string,
    card: { id: number; text: string }
  ) => void;
  findCard: (
    id: number,
    type: string
  ) => { index: number; card: { id: number; text: string } };
}

interface Item {
  id: number;
  originalIndex: number;
}

export const Card: FC<CardProps> = memo(function Card({
  cardType,
  id,
  text,
  moveCard,
  findCard,
}) {
  const originalIndex = findCard(id, cardType).index;
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: cardType,
      item: { id, originalIndex, type: cardType, card: { id, text } },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult();
        const didDrop = monitor.didDrop();
        console.log("item");
        console.log(dropResult);
        const { id: droppedId, originalIndex, type, card } = item;
        if (didDrop) {
          moveCard(droppedId, originalIndex, type, card);
        }
      },
    }),
    [id, originalIndex, moveCard]
  );

  const [{}, cardsRef] = useDrop(
    () => ({
      accept: [ItemTypes.UPPER_CARD, ItemTypes.LOWER_CARD],
      hover({ id: draggedItemId }: Item, monitor) {
        if (draggedItemId !== id) {
          const { index: overIndex } = findCard(id, cardType);
          const dropResult = monitor.getItem() as any;
          const didDrop = monitor.didDrop();

          console.log(cardType);
          console.log(didDrop);
          // here you want to make another function that will be called moveCardOnHover
          // similar to what u had before
        }
      },
      drop(item, monitor) {
        const dropItem = monitor.getItem();
        return { ...dropItem, christosIsSmart: true, cardType };
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [findCard]
  );
  // console.log({ cardType, isOver });
  const opacity = isDragging ? 0 : 1;
  return (
    <div ref={(node) => dragRef(cardsRef(node))} style={{ ...style, opacity }}>
      {text}
    </div>
  );
});
