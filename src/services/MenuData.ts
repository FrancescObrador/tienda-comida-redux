import {ref, push, set, remove, onValue} from 'firebase/database';
import {db} from './FireBase';
import { MenuItem, Order } from '../entities/entities';

export const addMenuItem = async (item: MenuItem) => {
    const itemsRef = ref(db, "menu");
    await push(itemsRef, item);
}

export const getMenu = async (): Promise<MenuItem[]> => {
    const itemsRef = ref(db, "menu");
    onValue(itemsRef, (snapshot) => {
        const data = snapshot.val();
        const formattedData = data ? 
        Object.entries(data).map(([id, value]) => ({id, ...(value as any)}) )
        : [];
        return formattedData as MenuItem[]
    })
    return []
}

// Orders

export const addOrder = async (item: MenuItem) => {
    const itemRef = ref(db, "orders");
    const orderRef = await push(itemRef, item);
    return orderRef.key;
}

export const getOrders = async (): Promise<Order[]> => {
    const ordersRef = ref(db, "orders");
    return new Promise((resolve) => {
        onValue(ordersRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            const formattedData = data ? 
                Object.entries(data).map(([id, value]) => ({
                    id,
                    items: [value as MenuItem]
                })) : [];

                console.log(formattedData)
            resolve(formattedData as Order[]);
        });
    });
}

export const updateOrder = async (orderId: string, order: Order) => {
    const orderRef = ref(db, `orders/${orderId}`);
    await set(orderRef, order);
}

export const deleteOrder = async (orderId: string) => {
    const orderRef = ref(db, `orders/${orderId}`);
    await remove(orderRef);
}
export const removeAllOrders = async () => {
    console.log("holi")
    const ordersRef = ref(db, 'orders');
    await remove(ordersRef);
}