

# Documentation 
Créer une nouvelle carte : 

```javascript
new Card(<Integer>: value, <String>: special = null, <String>: image = null);
```

- VALUE <Integer> : la valeur de la carte, le nombre de case qu'elle permet de franchir
- SPECIAL <String> *(facultatif)* : le nom de l'effet de spécial de la carte si elle en possède un
- IMAGE <String> *(facultatif)* : le lien de l'image de la carte

## Attributs spéciaux des cartes : 

Nom 					| Effet 
----					|------
`montagne` 				| La limite de mouvement en ascension est de 6 cases au lieu de 5
`récupération` 			| Suppression d'une carte fatigue présente dans la pile des cartes recylclées (sans effet si aucune carte fatigue n'y est présente)
`super aspiration` 		| Le coureur bénéficie de 2 cases d'aspiration au lieu d'une
`endurance` 				| La carte jouée est remise dans la pile des cartes recyclées
`descente` 				| Le déplacement en descente est de 7 cases au lieu de 5
`agile`					| Le coureur peut bénéfier d'une file supplémentaire s'il termine son mouvement sur une case déjà complètement occupée
`pas d'aspiration` 		| Le coureur ne permet pas à un autre coureur de bénéficer de son aspiration
`aspiration en montagne` 	| Le coureur peut bénéficier de l'aspiration donnée par un autre coureur même s'il est en ascension