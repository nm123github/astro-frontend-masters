
import { useStore } from '@nanostores/solid';
import { $cart as cart, removeItemFromCart, subTotal } from '../stores/cart';
import styles from './cart.module.css';
import { Show, createSignal } from 'solid-js';

function formatCurrency(amount: number) {
	return new Intl.NumberFormat('en-US', {
		currency: 'usd',
		style: 'currency',
	}).format(amount);
}

const EmptyState = () => {
    return (
        <>
            <p class={styles.icon}>
                <span role="img" aria-label='hot dog'>🌭</span>
            </p>
            <p class={styles.empty}>
                Your cart is empty! Add a sandwich kit or two and give flavour a chance.
            </p>
        </>
    )
}

const CheckoutNotice = () => {
    return <p class={styles.notice}>Checkout is not implemented yet.</p>
}

export const Cart = () => {
    const [showNotice, setShowNotice] = createSignal(false);
    const $subTotal = useStore(subTotal);
    const $cart = useStore(cart);

    return (
        <aside class={styles.cart}>
            <h2>Your cart</h2>
            <Show when={Object.values($cart()).length > 0} fallback={<EmptyState />}>
                <ul class={styles.items}>
                    {
                        Object.values($cart()).map((entry: CartItem) => {
                            if (!entry) return;
                            return (
                                <li class={styles.item}>
                                    <span class={styles.quantity}>{entry.quantity}</span>
                                    <span class={styles.name}>{entry.item.title}</span>
                                    <span class={styles.remove}><button title="remove item" onClick={() => removeItemFromCart(entry.item.id)}>&times;</button></span>
                                    <span class={styles.price}>{entry.item.price}</span>
                                </li>
                            )
                        })
                    }
                </ul>
                <div class={styles.details}>
                    <p class={styles.subTotal}>
                        <span class={styles.label}>Subtotal: </span>{' '}
                        {formatCurrency($subTotal())}
                    </p>
                    <p class={styles.shipping}>
                        <span class={styles.shipping}>Shipping: </span>{' '}
                        <del>$10.00</del>
                        <ins>Free!</ins>
                    </p>
                    <p class={styles.total}>
                        <span class={styles.total}>Total: </span>{' '}
                        {formatCurrency($subTotal())}
                    </p>

                    <p class={styles.checkout}>
                        <button class="big-link" onClick={() => setShowNotice(true)}>Check out</button>
                    </p>

                    <Show when={showNotice()}>
                        <CheckoutNotice />
                    </Show>
                </div>
            </Show>
        </aside>
    )
}