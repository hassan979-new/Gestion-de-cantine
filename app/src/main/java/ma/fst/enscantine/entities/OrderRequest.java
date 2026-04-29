package ma.fst.enscantine.entities;

import java.util.List;

public class OrderRequest {
    public int user_id;
    public List<OrderItem> items;
    public double total_price;  // ← add this

    public OrderRequest(int user_id, List<OrderItem> items, double total_price) {
        this.user_id = user_id;
        this.items = items;
        this.total_price = total_price;
    }
}