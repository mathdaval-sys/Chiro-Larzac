CHIRO’LARZAC — VERSION AUTONOME

MISE À JOUR DE LA CARTE
1. Dans GitHub, ouvrez data/donnees-communes.csv.
2. Cliquez sur le crayon « Edit this file ».
3. Remplissez ou modifiez uniquement les chiffres après le nom de la commune.
4. Respectez les points-virgules ; laissez une case vide si la donnée n’est pas connue.
5. Indiquez la date sous la forme 2026-07-21.
6. Cliquez sur « Commit changes ».
La carte se met à jour automatiquement après la publication de GitHub Pages.

AJOUT D’UNE ACTUALITÉ
1. Téléversez d’abord la photographie dans assets/images/actualites/.
2. Ouvrez MODELE-ACTUALITE.md et copiez son contenu.
3. Dans le dossier _posts, créez un fichier nommé AAAA-MM-JJ-titre-court.md.
4. Collez le modèle et remplacez le titre, la date, le résumé, le nom de l’image et le texte.
5. Cliquez sur « Commit changes ».
La page de l’article et la liste des actualités sont générées automatiquement.

IMPORTANT
- Ne modifiez pas la première colonne « id » du fichier CSV.
- Ne publiez jamais la localisation précise d’un gîte sensible.
- Les contours de la carte sont volontairement schématiques.

MISE À JOUR DE LA CARTE — VERSION À CONTOURS RÉELS
---------------------------------------------------
Les formes des communes sont désormais chargées automatiquement depuis l'API géographique officielle de l'État.
Le fichier data/donnees-communes.csv contient une colonne "departement" : ne la supprimez pas.
Vous ne modifiez toujours que les chiffres et la date de mise à jour. Les contours et les étiquettes sont automatiques.
La carte a besoin d'une connexion internet lors de son affichage, comme les polices et la bibliothèque Leaflet du site.


CARTE V6
La carte utilise désormais data/communes.geojson, généré à partir du shapefile fourni. Pour mettre à jour les chiffres, modifier uniquement data/donnees-communes.csv en conservant les codes INSEE.
