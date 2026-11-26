import { observer } from 'mobx-react-lite';
import { MenuItem, Text } from '@deriv-com/ui';

const items = [
    ['Dashboard', 'dashboard'],
    ['Bot Builder', 'bot-builder'],
    ['Free Bots', 'free-bots'],
    ['Pro Scanner', 'pro-scanner'],
    ['Strategy Pro', 'strategy-pro'],
    ['Speedbot', 'speedbot'],
    ['AI Software', 'ai-software'],
    ['Auto Trade', 'auto-trade'],
    ['Manual Trade', 'manual-trade'],
    ['Bulk Trader', 'bulk-trader'],
    ['Charts', 'charts'],
    ['Copy Trader', 'copy-trader'],
    ['Risk Calculator', 'risk-calculator'],
    ['Trade Academy', 'trade-academy'],
];

export const MenuItems = observer(() => (
    <nav aria-label='MBUNIFX tools' className='app-header__menu' style={{ display: 'flex', gap: 8, overflowX: 'auto', maxWidth: 'min(72vw, 900px)' }}>
        <MenuItem as='a' href='/tools/dashboard' className='app-header__menu'>
            <Text size='sm'>MBUNIFX</Text>
        </MenuItem>
        {items.map(([label, id]) => (
            <MenuItem key={id} as='a' href={`/tools/${id}`} className='app-header__menu'>
                <Text size='sm'>{label}</Text>
            </MenuItem>
        ))}
    </nav>
));

export const TradershubLink = observer(() => null);

type MenuItemsType = typeof MenuItems & { TradershubLink: typeof TradershubLink };
(MenuItems as MenuItemsType).TradershubLink = TradershubLink;

export default MenuItems as MenuItemsType;
