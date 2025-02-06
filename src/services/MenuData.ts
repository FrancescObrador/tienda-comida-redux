import {ref, push, onValue} from 'firebase/database';
import {db} from './FireBase';
import { MenuItem } from '../entities/entities';
import logger from '../utilities/Logger';

export const addMenuItem = async (item: MenuItem) => {
    const itemsRef = ref(db, "menu");
    await push(itemsRef, item);
}

export const addOrder = async (item: MenuItem) => {
    logger.info("addOrder to await")
    const itemRef = ref(db, "orders");
    await push(itemRef, item);
    logger.info("addOrder awaited")
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