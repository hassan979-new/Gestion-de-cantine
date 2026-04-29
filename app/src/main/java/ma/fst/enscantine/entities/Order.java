package ma.fst.enscantine.entities;

import java.util.List;

public class Order {
    public int id;
    public String status;
    public String createdAt;

    public List<OrderItem> items;
}