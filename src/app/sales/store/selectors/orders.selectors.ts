import { createSelector } from '@ngrx/store';
import * as fromOrders from '../reducers/orders.reducer';
import { selectSalesState } from './index';
import { Order } from '../../../core/api';
import { isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, parseISO } from 'date-fns';

export const selectOrdersState = createSelector(
  selectSalesState,
  (state) => state[fromOrders.ordersFeatureKey],
);

export const selectOrdersList = createSelector(
  selectOrdersState,
  (state) => state.list,
);

export const selectOrdersListWithItems = createSelector(
  selectOrdersList,
  (orders): (Order & { itemsCount: number; itemsTotal: number })[] =>
    orders.map((order) => ({
      ...order,
      itemsCount: order.items.reduce((acc, item) => acc + item.quantity, 0),
      itemsTotal: order.items.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0,
      ),
    })),
);

export const selectSalesListWithItems = createSelector(
  selectOrdersList,
  (sales): (Order & { itemsCount: number; itemsTotal: number })[] =>
    sales.map((order) => ({
      ...order,
      itemsCount: order.items.reduce((acc, item) => acc + item.quantity, 0),
      itemsTotal: order.items.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0,
      ),
    })),
);

export const selectSelectedOrderId = createSelector(
  selectOrdersState,
  (state) => state.selectedOrderId,
);

export const selectSelectedOrder = createSelector(
  selectOrdersState,
  selectSelectedOrderId,
  (state, selectedOrderId) => {
    return selectedOrderId
      ? state.list.find((o) => o.id === selectedOrderId)
      : null;
  },
);

export const selectOrderStatusDistribution = createSelector(
  selectOrdersList,
  (orders) => {
    const statusCounts: { [key: string]: number } = {};
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    return statusCounts;
  }
);

export const selectOrdersByPeriod = (period: 'weekly' | 'monthly' | 'yearly') => createSelector(
  selectOrdersList,
  (orders) => {
    const now = new Date();
    let start: Date, end: Date;
    if (period === 'weekly') {
      start = startOfWeek(now, { weekStartsOn: 1 });
      end = endOfWeek(now, { weekStartsOn: 1 });
    } else if (period === 'monthly') {
      start = startOfMonth(now);
      end = endOfMonth(now);
    } else {
      start = startOfYear(now);
      end = endOfYear(now);
    }
    return orders.filter(order => {
      if (order.status === 'cancelled') return false;
      const created = parseISO(order.created);
      return isWithinInterval(created, { start, end });
    });
  }
);
