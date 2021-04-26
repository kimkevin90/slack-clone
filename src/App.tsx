import { useState } from 'react';
import { useQuery } from 'react-query';
import Drawer from '@material-ui/core/Drawer';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Badge from '@material-ui/core/Badge';

import { Wrapper, StyledButton } from './App.styles';
import Item from './Item/item';
import Cart from './Cart/Cart';

//타입
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};

const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch('https://fakestoreapi.com/products')).json();

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'products',
    getProducts,
  );
  // console.log(data);

  const getTotalItems = (items: CartItemType[]) => {
    const test = items.reduce((ack: number, item) => ack + item.amount, 0);
    console.log(test);
    return test;
  };

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems((prev) => {
      // console.log('나는prev', prev);
      // 1. 아이템이 이미있나?
      const isItemInCart = prev.find((item) => item.id === clickedItem.id);
      console.log(isItemInCart);
      //이미 카드에 똑같은 아이템이있다면 해당 아이템은 amount + 1하고
      // 나머지 아이템은 그대로 반환
      if (isItemInCart) {
        return prev.map((item) =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item,
        );
      }
      // 첫번째로 넣을때
      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems((prev) =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[]),
    );
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>에러있다</div>;
  console.log(cartItems);
  return (
    <Wrapper>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default App;
