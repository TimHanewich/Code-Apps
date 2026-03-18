# Integrating Your Code App with Dataverse Data

## Add the Dataverse Table
Use the PAC CLI to add Dataverse table "Contacts":

```
pac code add-data-source --apiId dataverse --table "contact"
```

You will see this add model and service files to your app that define the data model and service methods for interacting with your data.

## Perform Dataverse CRUD
[This documentation](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/connect-to-dataverse) provides excellent examples of how to then perform CRUD against your Dataverse table.

I used GitHub Copilot to code this within the app for me.

The first thing I did was ensure Copilot had the most up-to-date documentation on how to interface with Dataverse. I told GitHub Copilot to:

```
Read this: https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/connect-to-dataverse
```

After it confirmed it read it and was aware of the examples it contains, I instructed GitHub Copilot to use the methodologies laid out in that documentation to read the Contacts table from Dataverse (which I already added) and display on the home page:

```
Excellent. That documentation contains examples of how to CRUD against Dataverse in this react app. I now want you to modify the home screen of this react app to show me a list view of records in my contacts table. I've already added the contacts table to the app.
```

![pic](https://i.imgur.com/JrBK5TB.png)

Finally, I then prompted GitHub Copilot to add a button that would take the user to another screen in which they'd have a form presented to submit data for a *new* contact record:

```
I just checked, it works! Wonderful. I want there to also be a button to insert a new contact. Upon it being clicked on, a form appears that allows the user to enter in contacts details then hit submit to save it which takes them back to the home screen. And add a refresh button to the home screen so they can refresh the data.
```

And after Copilot builds out this functionality, my app looks like this!

![example](https://i.imgur.com/As4wqBD.gif)