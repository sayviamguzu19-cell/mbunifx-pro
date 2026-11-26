import { observer } from 'mobx-react-lite';

// The MBUNIFX workspace renders its single-row navigation directly below
// the brand header so it remains available on both desktop and mobile.
export const MenuItems = observer(() => null);

export const TradershubLink = observer(() => null);

type MenuItemsType = typeof MenuItems & { TradershubLink: typeof TradershubLink };
(MenuItems as MenuItemsType).TradershubLink = TradershubLink;

export default MenuItems as MenuItemsType;
