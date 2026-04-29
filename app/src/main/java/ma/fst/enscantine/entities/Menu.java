package ma.fst.enscantine.entities;

import com.google.gson.annotations.SerializedName;

public class Menu {
    public int id;

    @SerializedName("dish_name")
    public String name;

    public String description;
    public String price;

    @SerializedName("image_url")
    public String imageUrl;

    @SerializedName("available")
    public int available;

    @SerializedName("menu_date")
    public String date;
}