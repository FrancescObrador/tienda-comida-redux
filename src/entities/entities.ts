export interface MenuItem { 
    id: number
    name: string
    quantity: number
    desc: string
    price: number
    image: string
}

export interface Order {
    id: string
    items: MenuItem[]
}