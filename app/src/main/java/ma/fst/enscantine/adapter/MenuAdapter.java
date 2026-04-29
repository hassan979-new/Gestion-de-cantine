package ma.fst.enscantine.adapter;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.google.android.material.button.MaterialButton;

import java.util.List;

import ma.fst.enscantine.R;
import ma.fst.enscantine.entities.Menu;

public class MenuAdapter extends RecyclerView.Adapter<MenuAdapter.ViewHolder> {

    private List<Menu> list;
    private OnOrderClickListener listener;

    public interface OnOrderClickListener {
        void onOrderClick(Menu menu);
    }

    public void updateData(List<Menu> newMenus) {
        this.list = newMenus;
        notifyDataSetChanged();
    }

    public MenuAdapter(List<Menu> list, OnOrderClickListener listener) {
        this.list = list;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.meal_item, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Menu menu = list.get(position);

        // Backend column is dish_name, mapped to name via @SerializedName
        holder.name.setText(menu.name != null ? menu.name : "");
        Log.d("MENU_DEBUG", "Binding: " + menu.name);
        holder.price.setText(menu.price + " DH");

        String imageUrl = menu.imageUrl;

        if (imageUrl != null && !imageUrl.isEmpty()) {
            imageUrl = imageUrl.replace("localhost", "10.0.2.2");

            Glide.with(holder.itemView.getContext())
                    .load(imageUrl)
                    .placeholder(R.drawable.ic_launcher_background)
                    .error(R.drawable.ic_launcher_background)
                    .into(holder.image);
        } else {
            holder.image.setImageResource(R.drawable.ic_launcher_background);
        }

        if (menu.available == 1) {
            holder.availability.setText("Disponible");
            holder.availability.setTextColor(0xFF27AE60);
            holder.btn.setEnabled(true);
        } else {
            holder.availability.setText("Indisponible");
            holder.availability.setTextColor(0xFFE74C3C);
            holder.btn.setEnabled(false);
        }

        holder.btn.setOnClickListener(v -> {
            if (listener != null) {
                listener.onOrderClick(menu);
            }
        });



    }

    @Override
    public int getItemCount() {
        return list != null ? list.size() : 0;
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        ImageView image;
        TextView name, price, availability;
        MaterialButton btn;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            image = itemView.findViewById(R.id.menuImage);
            name = itemView.findViewById(R.id.menuName);
            price = itemView.findViewById(R.id.menuPrice);
            availability = itemView.findViewById(R.id.menuAvailability);
            btn = itemView.findViewById(R.id.commandeBtn);
        }
    }

}
