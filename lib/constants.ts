// lib/constants.ts

export const RESOURCES = {
    USERS: 'users',
    ACCOUNTS: 'accounts',
    SESSIONS: 'sessions',
    CHEFS: 'chefs',
    MENUS: 'menus',
    RECIPES: 'recipes',
    INGREDIENTS: 'ingredients',
    SUPPLIERS: 'suppliers',
    LOCATIONS: 'locations',
    SUPPLIER_LOCATIONS: 'supplier-locations',
    SUPPLIER_INGREDIENTS: 'supplier-ingredients',
    ORDERS: 'orders',
    ORDER_ITEMS: 'order-items',
    REVIEWS: 'reviews'
};

export const ENDPOINTS = Object.fromEntries(
    Object.values(RESOURCES).map(resource => [resource, `${resource}`])
);
