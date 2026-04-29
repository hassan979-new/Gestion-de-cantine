package ma.fst.enscantine.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.List;

import ma.fst.enscantine.R;
import ma.fst.enscantine.entities.Menu;

public class MenuAdapter extends RecyclerView.Adapter<MenuAdapter.ViewHolder> {

    private List<Menu> list;
    private OnOrderClickListener listener;

    // interface for button click
    public interface OnOrderClickListener {
        void onOrderClick(Menu menu);
    }

    public MenuAdapter(List<Menu> list, OnOrderClickListener listener) {
        this.list = list;
        this.listener = listener;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {

        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.meal_item, parent, false);

        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {

        Menu menu = list.get(position);

        holder.name.setText(menu.name);
        holder.price.setText(menu.price + " DH");

        String url = "http://10.0.2.2:3000/uploads/" + menu.image;

        Glide.with(holder.itemView.getContext())
                .load(url)
                .into(holder.image);

        // ⭐ BUTTON CLICK
        holder.btn.setOnClickListener(v -> {
            listener.onOrderClick(menu);
        });
    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {

        ImageView image;
        TextView name, price;
        Button btn;

        public ViewHolder(View itemView) {
            super(itemView);

            image = itemView.findViewById(R.id.menuImage);
            name = itemView.findViewById(R.id.menuName);
            price = itemView.findViewById(R.id.menuPrice);
            btn = itemView.findViewById(R.id.commandeBtn);
        }
    }
}
