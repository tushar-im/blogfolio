---

title: "Providing Model Field Choices in Django Rest Framework"
description: "Learn how to retrieve and provide choices for ChoiceField fields in Django models using a custom mixin in Django Rest Framework."
date: "10/11/2024"
---

In many Django Rest Framework (DRF) projects, you may have models with fields that use `ChoiceField` to restrict the values that can be stored in the database. For example, a `status` field might have choices like `["Draft", "Published", "Archived"]`. When building a frontend application, it’s often necessary to retrieve the available choices for these fields to render dropdowns, radio buttons, or other UI elements.

In this post, I’ll show you how to create a reusable **`GetFieldChoicesMixin`** that can be added to any `ModelViewSet` to provide the available choices for `ChoiceField` fields in your models.

---

## Why Provide Field Choices?

Providing field choices in your API has several benefits:
- **Frontend Flexibility**: The frontend can dynamically render UI elements (e.g., dropdowns) based on the available choices.
- **Consistency**: Ensures that the frontend and backend are always in sync regarding the allowed values for a field.
- **Reduced Hardcoding**: Avoids hardcoding choices in the frontend, making your application more maintainable.

---

## Implementation

The `GetFieldChoicesMixin` is a custom mixin that adds a `field_choices` action to your `ModelViewSet`. This action returns the available choices for all `ChoiceField` fields in the model.

### Step 1: Create the Mixin

Here’s the implementation of the `GetFieldChoicesMixin`:

```python
# core/api/mixins.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action


class GetFieldChoicesMixin:
    """
    Adds a GET action : `field_choices`
    ------------------------------------------------------------------------
    Returns choices for BaseModel fields with attribute `choices`.
    ------------------------------------------------------------------------
    """

    def get_choices(self, choices_tuple):
        keys = ["name", "value"]
        choices = [
            {key: value for key, value in zip(keys, choice_tuple)}
            for choice_tuple in choices_tuple
        ]

        return choices

    def get_choice_fields_data(self, choice_fields):
        choice_fields_data: list = []

        for choice_field in choice_fields:
            field_data: dict = {}
            field_data["name"] = choice_field.name
            field_data["choices"] = self.get_choices(choice_field.choices)
            choice_fields_data.append(field_data)

        return choice_fields_data

    def get_choice_fields(self, model_fields):
        choice_fields: list = []

        for field in model_fields:
            if field.choices is not None:
                choice_fields.append(field)

        return choice_fields

    @action(detail=False, methods=["get"])
    def field_choices(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        model = queryset.model
        choice_fields = self.get_choice_fields(model._meta.fields)

        response_data: dict = {}
        response_data["model"] = model.__name__
        response_data["fields"] = self.get_choice_fields_data(choice_fields)

        return Response(response_data, status=status.HTTP_200_OK)
```

### Step 2: Add the Mixin to Your ViewSets

You can now add the `GetFieldChoicesMixin` to your `ModelViewSet` or `ReadOnlyModelViewSet` classes. Here’s an example of how to do this:

```python
# core/api/viewsets.py
from rest_framework import mixins, viewsets
from core.api.mixins import GetFieldChoicesMixin


class BaseModelViewSet(viewsets.ModelViewSet, GetFieldChoicesMixin):
    pass


class BaseReadOnlyModelViewSet(viewsets.ReadOnlyModelViewSet, GetFieldChoicesMixin):
    pass
```

With this setup, any `ModelViewSet` that inherits from `BaseModelViewSet` or `BaseReadOnlyModelViewSet` will automatically have the `field_choices` action available.

---

## Example Usage

Let’s say you have a `Post` model with a `status` field that has the following choices:

```python
# models.py
class Post(models.Model):
    DRAFT = "Draft"
    PUBLISHED = "Published"
    ARCHIVED = "Archived"

    STATUS_CHOICES = [
        (DRAFT, "Draft"),
        (PUBLISHED, "Published"),
        (ARCHIVED, "Archived"),
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=DRAFT)
```

When you make a `GET` request to the `field_choices` action, you’ll get a response like this:

```json
{
  "model": "Post",
  "fields": [
    {
      "name": "status",
      "choices": [
        {"name": "Draft", "value": "Draft"},
        {"name": "Published", "value": "Published"},
        {"name": "Archived", "value": "Archived"}
      ]
    }
  ]
}
```

This response can be used by the frontend to dynamically render a dropdown for the `status` field.

---

## How It Works

1. **`get_choices`**: Converts a tuple of choices (e.g., `[("Draft", "Draft"), ("Published", "Published")]`) into a list of dictionaries with `name` and `value` keys.
2. **`get_choice_fields_data`**: Iterates over the fields with choices and prepares the data for the response.
3. **`get_choice_fields`**: Filters the model fields to find those with `choices` defined.
4. **`field_choices`**: The DRF action that handles the `GET` request and returns the choices for all `ChoiceField` fields in the model.

---

## Conclusion

The `GetFieldChoicesMixin` is a powerful and reusable way to provide field choices in your Django Rest Framework API. By adding this mixin to your `ModelViewSet`, you can ensure that your frontend always has access to the latest choices for `ChoiceField` fields, making your application more dynamic and maintainable.

If you found this post helpful, feel free to share it or leave a comment below! Happy coding! 🚀

---
