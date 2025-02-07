import { MouseEventHandler, useState } from 'react';
import { MenuItem } from '../entities/entities';
import { useDispatch } from 'react-redux';
import { createOrder } from '../features/orderSlice'; 
import { AppDispatch } from '../store';

interface FoodOrderProps {
    food: MenuItem;
    onReturnToMenu: MouseEventHandler<HTMLButtonElement> | undefined;
}

const FoodOrder = (props: FoodOrderProps) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [totalAmount] = useState(props.food.price);
    const [isOrdered, setIsOrdered] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
   
    const handleClick = async () => {
        setIsOrdered(true);

        let food = {...props.food, quantity: quantity};
        await dispatch(createOrder(food)); 
        
        setIsOrdered(false);
    }

    const total = quantity * totalAmount;

    return (
        <>
            {isOrdered && <div>Ordenando...</div>}
            <div>Total: ${total}</div>
            <input
                type="number"
                value={quantity}
                onChange={(e) => {setQuantity(Number(e.target.value))}}
            />
            <button onClick={handleClick}>Actualizar {props.food.name}</button>
        </>
    );
};

export default FoodOrder;