import './ItemCounter.css';

interface ItemCounterProps {
  count: number;
}

function ItemCounter({ count }: ItemCounterProps) {
  const itemText = count === 1 ? 'item' : 'items';

  return (
    <div className="item-counter">
      {count} {itemText} left
    </div>
  );
}

export default ItemCounter;
