# Create your models here.
from django.db import models
from django.utils import timezone

class Registro(models.Model):
    author = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    IP = models.GenericIPAddressField()
    describe_function = models.CharField(max_length=50)
    petition_date = models.DateTimeField(blank=True, null=True)

    def publish(self):
        self.petition_date = timezone.now()
        self.save()

    def __str__(self):
        s = "Author: "+str(self.author)+" with an IP: "+self.IP
        return s

#class subirDatos(models.Model):
#    author = models.ForeignKey('auth.User', on_delete=models.CASCADE)
#    IP = models.GenericIPAddressField()
#    petition_date = models.DateTimeField(blank=True, null=True)
    #Tenemos que subir los datos, ya veremos este campo
    #Hay que definir el media
    #FileField.storage¶
    #    A storage object, which handles the storage and retrieval of your files. See Managing files for details on how to provide this object.
    #The default form widget for this field is a ClearableFileInput.
    #Using a FileField or an ImageField (see below) in a model takes a few steps:
    #In your settings file, you’ll need to define MEDIA_ROOT as the full path to a directory where you’d like Django to
    #store uploaded files. (For performance, these files are not stored in the database.) Define MEDIA_URL as the base
    #public URL of that directory. Make sure that this directory is writable by the Web server’s user account.
    #data=models.FileField()
#    def publish(self):
#        self.petition_date = timezone.now()
#        self.save()

#    def __str__(self):
#        return "Author: "+self.author+" with an IP: "+self.IP
