import React, { Suspense, useEffect, useState } from 'react'
import { MenuItem, Order } from './entities/entities';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { fetchOrders, deleteAllOrders } from './features/orderSlice';

export const foodItemsContext = React.createContext<MenuItem[]>([]);

const Foods = React.lazy(() => import('./components/Foods'))

function App() {
  
  const [menuItems] = useState<MenuItem[]>([
    {
      "id": 1,
      "name": "Hamburguesa de Pollo",
      "quantity": 40,
      "desc": "Hamburguesa de pollo frito - ... y mayonesa", "price": 24,
      "image": "pollo.jpeg"
      },
      {
        "id": 2,
        "name": "Hamburguesa de vaca",
        "quantity": 20,
        "desc": "Hamburguesa de vaca - ... y ketsup", "price": 24,
        "image": "pollo.jpeg"
        },
  ]);

  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.order.orders)
  const [isChooseFoodPage, setIsChooseFoodPage] = useState(false);
  
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch])


  return (
    <>
      <foodItemsContext.Provider value={menuItems}>
        <ErrorBoundary fallback={<div>Ha ocurrido un error</div>}>
        <div className="App">
          <button className='toggleButton' onClick={() => {
            setIsChooseFoodPage(!isChooseFoodPage);
          }}>
            {isChooseFoodPage? "Disponibilidad" : "Pedir comida"}
          </button>

        <h3 className="title">Comida Rápida Online</h3> 
          
          {!isChooseFoodPage && (
            <>
              <h4 className="subTitle">Menús</h4> 
                <ul className="ulApp">
                  {menuItems.map((item) => { return (
                  <li key={item.id} className="liApp"> 
                    <p>{item.name}</p> 
                    <p>#{item.quantity}</p>
                  </li> );
                })} 
                </ul> 

            </>
          )}
          
          {isChooseFoodPage && 
            <Suspense fallback={<div>Cargando...</div>}>
              <Foods foodItems={menuItems}></Foods>
            </Suspense>
          }
          
        </div>
        <h2>Pedidos realizados:</h2>
        <ul>
          {
            orders.map((order: Order) => {
              return <li key={order.id}>
                <ul>
                  {
                    order.items.map((item, index) => {
                        return (
                        <>
                          <li key={index}>{item.name}</li>
                          <li key={item.quantity*item.price}>{item.quantity} * {item.price}</li>
                        </>
                        )
                    })
                  }
                </ul>
              </li>
            })
          }
          </ul>
        </ErrorBoundary>
        <button onClick={() => dispatch(deleteAllOrders())}>Reset Firebase</button>
      </foodItemsContext.Provider>
      
    
    </>
  )
}

export default App
