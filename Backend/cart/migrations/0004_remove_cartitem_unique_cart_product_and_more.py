from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cart", "0003_alter_cartitem_product"),
    ]

    operations = [
        # Remove the old ForeignKey-based constraint.
        migrations.RemoveConstraint(
            model_name="cartitem",
            name="unique_cart_product",
        ),
        # Rename the existing product ForeignKey field.
        # Its database column is already named product_id.
        migrations.RenameField(
            model_name="cartitem",
            old_name="product",
            new_name="product_id",
        ),
        # Change the ForeignKey into a normal integer field.
        migrations.AlterField(
            model_name="cartitem",
            name="product_id",
            field=models.PositiveIntegerField(default=0),
            preserve_default=False,
        ),
        # Add uniqueness for each cart and external product ID.
        migrations.AddConstraint(
            model_name="cartitem",
            constraint=models.UniqueConstraint(
                fields=("cart", "product_id"),
                name="unique_cart_product",
            ),
        ),
    ]
