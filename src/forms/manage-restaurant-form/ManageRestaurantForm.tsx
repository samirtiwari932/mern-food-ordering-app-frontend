import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DetailsSection from "./DeatilsSection";
import { Separator } from "@/components/ui/separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import ImageSection from "./ImageSection";
import LoadingButton from "@/components/ui/LoadingButton";
import { Button } from "@/components/ui/button";
import type { Restaurant } from "@/types";
import { useEffect } from "react";

const formSchema = z
  .object({
    restaurantName: z.string().min(1, "Restaurant name is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    deliveryPrice: z.coerce
      .number()
      .min(0, "Delivery price is required and must be a valid number"),
    estimatedDeliveryTime: z.coerce
      .number()
      .min(1, "Estimated delivery time is required and must be a valid number"),
    cuisines: z
      .array(z.string())
      .nonempty("Please select at least one cuisine"),
    menuItems: z.array(
      z.object({
        name: z.string().min(1, "Menu item name is required"),
        price: z.coerce.number().min(1, "Menu item price is required"),
      })
    ),
    imageUrl: z.string().optional(),
    imageFile: z
      .any()
      .refine((file) => file instanceof File, {
        message: "Please select a valid image file",
      })
      .optional(),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Either image Url or image file must be provided ",
    path: ["imageFile"],
  });

type RestaurantFormData = z.infer<typeof formSchema>;

type ManageRestaurantFormProps = {
  onSave: (restaurantFormData: FormData) => void;
  isLoading: boolean;
  restaurant?: Restaurant;
};

const ManageRestaurantForm = ({
  onSave,
  isLoading,
  restaurant,
}: ManageRestaurantFormProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisines: [],
      menuItems: [{ name: "", price: 0 }],
    },
  });

  useEffect(() => {
    if (!restaurant) {
      return;
    }
    const deliveryPriceFormatted = parseInt(
      (restaurant.deliveryPrice / 100).toFixed(2)
    );

    const menuItemFormatted = restaurant.menuItems.map((item) => ({
      ...item,
      price: parseInt((item.price / 100).toFixed(2)),
    }));

    const updatedRestaurant = {
      ...restaurant,
      deliveryPrice: deliveryPriceFormatted,
      menuItems: menuItemFormatted,
    };
    form.reset(updatedRestaurant);
  }, [form, restaurant]);

  const onSubmit = (formDataJson: RestaurantFormData) => {
    const formData = new FormData();
    formData.append("restaurantName", formDataJson.restaurantName);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append(
      "deliveryPrice",
      (formDataJson.deliveryPrice * 100).toString()
    );
    formData.append(
      "estimatedDeliveryTime",
      formDataJson.estimatedDeliveryTime.toString()
    );
    formDataJson.cuisines.forEach((cuisine, index) => {
      formData.append(`cuisines[${index}]`, cuisine);
    });
    formDataJson.menuItems.forEach((menuItems, index) => {
      formData.append(`menuItems[${index}][name]`, menuItems.name);
      formData.append(
        `menuItems[${index}][price]`,
        (menuItems.price * 100).toString()
      );
    });
    formData.append(`imageFile`, formDataJson.imageFile);
    onSave(formData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-gray-50 p-10 rounded-lg"
      >
        <DetailsSection />
        <Separator />
        <CuisinesSection />
        <MenuSection />
        <Separator />
        <ImageSection />
        {isLoading ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
};

export default ManageRestaurantForm;
