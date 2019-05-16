
from django.contrib.postgres.fields import JSONField
from django.db import models
from rest_framework.utils.encoders import JSONEncoder

from fields import CommaSepField

class Machine(models.Model):
    """
    A register machine, with N registers, each with a non-negative integer value.
    """
    size = models.IntegerField(default=8)
    values = CommaSepField()



    