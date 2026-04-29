package ma.fst.enscantine.adapter;

import android.util.Log;
import android.view.*;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.Gson;

import java.util.List;

import ma.fst.enscantine.R;
import ma.fst.enscantine.entities.Order;
import ma.fst.enscantine.entities.OrderItem;

public class OrdersAdapter extends RecyclerView.Adapter<OrdersAdapter.ViewHolder> {

    private List<Order> list;

    private OnCancelClickListener listener;

    public interface OnCancelClickListener {
        void onCancelClick(Order order);
    }

    public OrdersAdapter(List<Order> list, OnCancelClickListener listener) {
        this.list = list;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.order_item, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {

        Order order = list.get(position);

        holder.id.setText("Commande #" + order.id);
        holder.date.setText(order.createdAt);

        if (order.status.equals("en_attente")) {
            holder.status.setTextColor(0xFFE67E22);
        } else if (order.status.equals("prete")) {
            holder.status.setTextColor(0xFF27AE60);
        }


        switch (order.status) {
            case "en attente":
                holder.status.setText("En attente");
                break;
            case "en préparation":
                holder.status.setText("En préparation");
                break;
            case "prête":
                holder.status.setText("Prête");
                break;
            case "servie":
                holder.status.setText("Servie");
                break;
            case "annulée":
                holder.status.setText("Annulée");
                break;
            default:
                holder.status.setText(order.status);
        }


        StringBuilder itemsText = new StringBuilder();
        int totalQty = 0;

        if (order.items != null) {
            for (OrderItem item : order.items) {
                itemsText.append(item.dish_name)
                        .append(" x")
                        .append(item.quantity)
                        .append("\n");

                totalQty += item.quantity;
            }
        }

        holder.items.setText(itemsText.toString());
        holder.quantity.setText("Total: " + totalQty);

        if (order.status.equals("servie") || order.status.equals("annulée")) {
            holder.cancelBtn.setVisibility(View.GONE);
        } else {
            holder.cancelBtn.setVisibility(View.VISIBLE);
        }

        holder.cancelBtn.setOnClickListener(v -> {
            if (listener != null) {
                listener.onCancelClick(order);
            }
        });
    }

    @Override
    public int getItemCount() {
        return list != null ? list.size() : 0;
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {

        TextView id, status, date, items, quantity;
        Button cancelBtn;



        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            id = itemView.findViewById(R.id.orderId);
            status = itemView.findViewById(R.id.orderStatus);
            date = itemView.findViewById(R.id.orderDate);
            items = itemView.findViewById(R.id.orderItems);
            quantity = itemView.findViewById(R.id.orderQuantity);
            cancelBtn = itemView.findViewById(R.id.btnCancel);
        }
    }
    public void updateData(List<Order> newOrders) {
        this.list = newOrders;
        notifyDataSetChanged();
    }
}