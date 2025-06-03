export const ErrorCodes: { [key: string]: string } =
    {
        DEFAULT: "Une erreur inconnue est survenue, veuillez réessayer. Si le problème persiste, merci de contacter les administrateurs.",

        AUTH_BAD_CREDENTIALS: "Les identifiants fournis sont incorrects.",

        USER_MUST_BE_AUTHENTICATED: "L'utilisateur doit être authentifié.",
        USER_EMAIL_MUST_NOT_BE_EMPTY: "Un utilisateur ne peut pas être créé sans adresse email.",
        USER_EMAIL_ALREADY_EXISTS: "Un utilisateur existe déjà avec l'adresse email.",
        USER_EMPLOYE_CANNOT_POST_FOR_RESPONSABLE: "Les employés ne peuvent pas agir pour les responsables ou les autres employés.",
        USER_NOT_FOUND: "L'utilisateur n'a pas pu être trouvé.",
        USER_OLD_PASSWORD_INCORRECT: "L'ancien mot de passe ne correspond pas.",

        CONTACT_MESSAGE_EMPTY: "Le message ne peut pas être vide.",

        FERME_NOT_FOUND_FOR_USER: "La ferme n'a pu être trouvée pour l'utilisateur.",
        FERME_NOT_FOUND: "La ferme n'a pu être trouvée.",
        FERME_CODE_POSTAL_INCORRECT: "Le code postal doit contenir exactement 5 caractères.",
        FERME_CONFIGURATION_ACTIVITE_CATEGORIE_EMPTY: "La catégorie ne peut pas être nulle pour ajouter une activité à la ferme.",

        PARCELLE_TYPE_NOT_FOUND: "Le type parcelle n'a pu être trouvé.",
        PARCELLE_NOT_FOUND: "La parcelle n'a pu être trouvée pour la ferme concernée.",
        PARCELLE_LONGUEUR_INCORRECT: "La longueur doit être supérieure à 0.",
        PARCELLE_LARGEUR_INCORRECT: "La largeur doit être supérieure à 0.",
        PARCELLE_NOM_DEJA_EXISTANT: "Le nom de parcelle est déjà utilisée.",
        TYPE_PARCELLE_NOT_FOUND: "Le type parcelle n'a pu être trouvée pour la ferme concernée.",
        TYPE_PARCELLE_NOM_NOT_FOUND: "Le type parcelle n'a pu être trouvée pour la ferme concernée.",

        ACTIVITE_NOT_FOUND: "L'activité n'a pas pu être trouvée.",
        ACTIVITE_NOM_NOT_FOUND: "L'activité avec le n'a pas pu être trouvée.",
        ACTIVITE_QUERY_TOO_SHORT: "Le paramètre 'query' doit au moins contenir 3 caractères.",

        CULTURE_NOT_FOUND: "La culture n'a pas pu être trouvée.",
        CULTURE_NOM_NOT_FOUND: "La culture avec ce nom n'a pas pu être trouvée.",
        CULTURE_QUERY_TOO_SHORT: "Le paramètre 'query' doit au moins contenir 3 caractères, or il en contient.",

        UNITE_NOT_FOUND: "L'unité n'a pas pu être trouvée.",

        TACHE_CALENDRIER_FILTRE_INCORRECT: "Vous devez filtrer soit par mois, soit par semaine, pas les 2 ou aucun.",
        TACHE_CALENDRIER_ANNEE_OBLIGATOIRE: "Le filtre année est obligatoire.",
        TACHE_CALENDRIER_USERID_OBLIGATOIRE: "Le filtre user_id est obligatoire.",
        TACHE_DUREE_INCORRECTE: "La durée de la tâche doit être comprise entre 1 et 1440.",
        TACHE_TOTAL_FILTRE_INCORRECTE: "Les filtres date (format dd/MM/yyyy) et user_id ne semblent pas correctes.",

        VOCAL_FILE_UPLOAD: "Erreur lors de la récupération du message vocal depuis la requête",
        VOCAL_DATE_INCORRECTE: "La date fournie est incorrecte, elle doit être au format ddMMYYYY.",
        VOCAL_DATE_MANQUANTE: "Le filtre date ne doit pas être vide lorsque le filtre origine est à 'taches'.",
        VOCAL_ORIGINE_INCORRECTE: "Le filtre origine n'est pas correcte, doit être égal à une des valeurs suivantes : taches|parcelles.",
        VOCAL_NOT_FOUND: "Le vocal n'a pas été trouvé.",

        SUGGESTIONS_ACTIVITE_MISSING: "Le filtre 'activite_id' n'ets pas fourni.",
        SUGGESTIONS_CULTURE_MISSING: "Le filtre 'culture_id' n'ets pas fourni.",
    }
