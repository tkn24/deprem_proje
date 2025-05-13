using { deprem as db } from '../db/data-model';
service DepremService {
    entity SonDepremler as projection on db.Deprem;
}