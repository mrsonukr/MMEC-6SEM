PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     TEXT UNIQUE NOT NULL,
  full_name   TEXT NOT NULL,
  role        TEXT CHECK(role IN ('student','teacher')) NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "users" ("id","user_id","full_name","role","email","created_at","updated_at") VALUES(2,'1123201','OTP Guru','student','mrotpguru@gmail.com','2026-02-21 07:27:27','2026-02-21 07:27:27');
INSERT INTO "users" ("id","user_id","full_name","role","email","created_at","updated_at") VALUES(3,'11232628','Gauri Singhal','student','singhalg818@gmail.com','2026-02-25 03:17:05','2026-02-25 03:17:05');
INSERT INTO "users" ("id","user_id","full_name","role","email","created_at","updated_at") VALUES(4,'000021','Sonu Kumar','student','mynepcure@gmail.com','2026-02-25 03:20:00','2026-02-25 03:20:00');
INSERT INTO "users" ("id","user_id","full_name","role","email","created_at","updated_at") VALUES(6,'11232940','Faizul Haque Rizwi','student','faizulhaque2002@gmail.com','2026-03-11 04:08:47','2026-03-11 04:08:47');
INSERT INTO "users" ("id","user_id","full_name","role","email","created_at","updated_at") VALUES(7,'11232763','Sonu Kumar','student','mssonukr@gmail.com','2026-03-25 04:01:21','2026-03-25 04:01:21');
CREATE TABLE auth (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id_ref     INTEGER NOT NULL UNIQUE,
  auth_provider   TEXT NOT NULL,
  password_hash   TEXT,
  google_id       TEXT,
  last_login      TIMESTAMP,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id_ref) REFERENCES users(id) ON DELETE CASCADE
);
INSERT INTO "auth" ("id","user_id_ref","auth_provider","password_hash","google_id","last_login","created_at","updated_at") VALUES(2,2,'local','471a6a094616fcb5037f0483a6bfa8f731d1d3d87695795918e3a1741a73dfa1','105983382139336860627','2026-04-01 07:39:37','2026-02-21 07:27:39','2026-04-01 07:39:37');
INSERT INTO "auth" ("id","user_id_ref","auth_provider","password_hash","google_id","last_login","created_at","updated_at") VALUES(3,3,'local','519b0ba2a0dc57738af586fac2398d0318922cc84e38e9b7186fda5ea511bd20','116313255431152647620','2026-04-01 05:37:56','2026-02-25 03:19:07','2026-04-01 05:37:56');
INSERT INTO "auth" ("id","user_id_ref","auth_provider","password_hash","google_id","last_login","created_at","updated_at") VALUES(4,4,'google',NULL,'104161193881687589533','2026-02-25 03:20:12','2026-02-25 03:20:12','2026-02-25 03:20:12');
INSERT INTO "auth" ("id","user_id_ref","auth_provider","password_hash","google_id","last_login","created_at","updated_at") VALUES(6,6,'google',NULL,'107931434877104830216','2026-03-11 04:08:58','2026-03-11 04:08:58','2026-03-11 04:08:58');
INSERT INTO "auth" ("id","user_id_ref","auth_provider","password_hash","google_id","last_login","created_at","updated_at") VALUES(7,7,'google',NULL,'116351823868742094418','2026-03-25 04:01:30','2026-03-25 04:01:30','2026-03-25 04:01:30');
CREATE TABLE password_reset_tokens (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id_ref INTEGER NOT NULL,
  token       TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMP NOT NULL,
  used        INTEGER DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id_ref) REFERENCES users(id) ON DELETE CASCADE
);
INSERT INTO "password_reset_tokens" ("id","user_id_ref","token","expires_at","used","created_at") VALUES(5,2,'KV8J27re37SH4GWT49uitjuaDc67ulvGg9zyv2093YjVhOVx','2026-02-21T08:35:16.673Z',1,'2026-02-21 07:35:16');
INSERT INTO "password_reset_tokens" ("id","user_id_ref","token","expires_at","used","created_at") VALUES(6,2,'pyM9Jm3EGDdXytWVlJxdjXLXRXBashP8vBDqL1DDHNt1EBIw','2026-02-21T08:40:24.504Z',0,'2026-02-21 07:40:24');
INSERT INTO "password_reset_tokens" ("id","user_id_ref","token","expires_at","used","created_at") VALUES(7,2,'NTBX7oAlJAXWnpHoPHPNWX3L2xqb4uUlYQoavEBWooJzmSww','2026-02-21T12:00:11.425Z',0,'2026-02-21 11:00:11');
INSERT INTO "password_reset_tokens" ("id","user_id_ref","token","expires_at","used","created_at") VALUES(8,2,'hi9GIAmtBbAqsh9fT5QYvPa3YuNPxbn1u5jgqKauEs3vTVE0','2026-02-21T12:02:36.243Z',0,'2026-02-21 11:02:36');
INSERT INTO "password_reset_tokens" ("id","user_id_ref","token","expires_at","used","created_at") VALUES(9,2,'gv37lL1si7etgGBS0iiLANhssDXgZmQbO2g4FIjXFWeMVduG','2026-02-21T12:03:51.899Z',0,'2026-02-21 11:03:51');
INSERT INTO "password_reset_tokens" ("id","user_id_ref","token","expires_at","used","created_at") VALUES(11,3,'MDwjCRkzXzps5FGncCL1xHil9lsqWyP67eBU8UazDW0hvazj','2026-02-25T04:17:48.511Z',1,'2026-02-25 03:17:48');
INSERT INTO "password_reset_tokens" ("id","user_id_ref","token","expires_at","used","created_at") VALUES(13,3,'wvTjSz8vrGA8DMA7xTiA98vPpBbm8QRwEu55UjkRcgyHDtwI','2026-03-11T05:08:45.612Z',1,'2026-03-11 04:08:45');
INSERT INTO "password_reset_tokens" ("id","user_id_ref","token","expires_at","used","created_at") VALUES(14,3,'csw7UqeAkug2CoHv0xEKo0kjkYcNzBAHFA4CH1zi5nYAqEFd','2026-03-25T04:44:42.210Z',0,'2026-03-25 03:44:42');
CREATE TABLE sessions (
  session_id         TEXT PRIMARY KEY,
  user_id            TEXT NOT NULL,
  refresh_token_hash TEXT,
  ip_address         TEXT,
  device             TEXT,
  browser            TEXT,
  os                 TEXT,
  country            TEXT,
  login_time         DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_active        DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at         DATETIME NOT NULL,
  is_active          INTEGER DEFAULT 1
);
INSERT INTO "sessions" ("session_id","user_id","refresh_token_hash","ip_address","device","browser","os","country","login_time","last_active","expires_at","is_active") VALUES('enBBk5Yr7jjeDrspNE1Jm2Vu8rDBPw95','2','7f64e617ef2fa7a638472bee64f74f561e5b34a1c026787f49df320b97a25c92','38.137.14.196','Desktop','Chrome','Windows','IN','2026-02-21 07:27:40','2026-02-21 07:27:40','2026-02-28T07:27:39.973Z',1);
INSERT INTO "sessions" ("session_id","user_id","refresh_token_hash","ip_address","device","browser","os","country","login_time","last_active","expires_at","is_active") VALUES('o9Q4VA9EYLdOZ6f0quTguvN2wp7D6C3D','2','22670dee0e389d2fdda4c8ce5839f8ae3f838d2d488cad6989437fee732b021e','38.137.14.196','Desktop','Chrome','Windows','IN','2026-02-21 07:36:35','2026-02-21 07:36:35','2026-02-28T07:36:35.008Z',1);
INSERT INTO "sessions" ("session_id","user_id","refresh_token_hash","ip_address","device","browser","os","country","login_time","last_active","expires_at","is_active") VALUES('mwIEyxDuIsghAd3fj1xnRwsYxb0P9R7r','2','07b1874a177c2a8556067b36695f43a992883e67a7396581398f36718a0d0b85','38.137.14.196','Desktop','Chrome','Windows','IN','2026-02-21 11:09:19','2026-02-21 11:09:19','2026-02-28T11:09:19.523Z',1);
INSERT INTO "sessions" ("session_id","user_id","refresh_token_hash","ip_address","device","browser","os","country","login_time","last_active","expires_at","is_active") VALUES('R4COuVt4fOjqDliIlvHWPnri82O4gRm4','3','7262ff1ee6bb80c11cccd8f6d7c8fdd1c76f004f496df86c50b5acecb167b739','117.236.98.98','Desktop','Chrome','Windows','IN','2026-02-25 03:19:28','2026-02-25 03:19:28','2026-03-04T03:19:28.645Z',1);
INSERT INTO "sessions" ("session_id","user_id","refresh_token_hash","ip_address","device","browser","os","country","login_time","last_active","expires_at","is_active") VALUES('0oiGomc4mkWdTw9wBH9G9CxVmeB6M0YW','4','a67d6829c10265d24515d86cc10497e1dfdf2d6728803a4bde5ba970b210ba45','117.236.98.98','Desktop','Chrome','Windows','IN','2026-02-25 03:20:12','2026-02-25 03:20:12','2026-03-04T03:20:12.550Z',1);
INSERT INTO "sessions" ("session_id","user_id","refresh_token_hash","ip_address","device","browser","os","country","login_time","last_active","expires_at","is_active") VALUES('thCyScnSdb5Y8BEVtap8zoeQY33eor18','5','0a5813a5ae243cea424011db3ea8916b5c939559ba98231ba0ff80dc58d4249c','117.236.98.98','Desktop','Chrome','Windows','IN','2026-03-11 04:07:28','2026-03-11 04:07:28','2026-03-18T04:07:28.437Z',1);
INSERT INTO "sessions" ("session_id","user_id","refresh_token_hash","ip_address","device","browser","os","country","login_time","last_active","expires_at","is_active") VALUES('qpmxObqNwjzGsr8rByPtZH3dePpQQqtr','5','a02a850f9e8ab921a194167237cf44906a30860f948a68c1c7681b020728de01','117.236.98.98','Desktop','Chrome','Windows','IN','2026-03-11 04:07:53','2026-03-11 04:07:53','2026-03-18T04:07:53.637Z',1);
INSERT INTO "sessions" ("session_id","user_id","refresh_token_hash","ip_address","device","browser","os","country","login_time","last_active","expires_at","is_active") VALUES('hsAEtmbtmsvLeCRP9nxtzXQviYW7nc5R','6','c8db7bf4beb6056b419448b0a72a8359cc6e45b1f4eb7aa1058241ef4c96c9ea','2409:40d6:49f:91cc:c4b7:c08e:a90f:e54','Desktop','Chrome','Windows','IN','2026-03-11 04:08:58','2026-03-11 04:08:58','2026-03-18T04:08:58.261Z',1);
INSERT INTO "sessions" ("session_id","user_id","refresh_token_hash","ip_address","device","browser","os","country","login_time","last_active","expires_at","is_active") VALUES('dzB3FViCAr1xCaNtmPO5QieBRrCjmz2r','3','5efa791cac5a123e1f762ac9765accff3c24c8e4d5cc5f4dac4dacac3b91d027','117.236.98.98','Desktop','Chrome','Windows','IN','2026-03-11 04:09:39','2026-03-11 04:09:39','2026-03-18T04:09:39.802Z',1);
INSERT INTO "sessions" ("session_id","user_id","refresh_token_hash","ip_address","device","browser","os","country","login_time","last_active","expires_at","is_active") VALUES('nduTTXpGKHuT2kEdDb2l4xKH5ik3HIpq','3','d0c01a493e31e2bd2edfece32585b988b3117d95d389c3ad80825c3127bc22ac','117.236.98.98','Desktop','Chrome','Windows','IN','2026-03-11 05:48:06','2026-03-11 05:48:06','2026-03-18T05:48:05.979Z',1);
INSERT INTO "sessions" ("session_id","user_id","refresh_token_hash","ip_address","device","browser","os","country","login_time","last_active","expires_at","is_active") VALUES('4Tcf6wCM9DBA7w8JbL6ts2JJ3ODFJip0','3','5213461744679c1715fb3f8078b9b00a215bea0298ee11c74619729d01f84d37','2409:40d2:1012:5373:2014:7f9e:4612:a104','Desktop','Chrome','Windows','IN','2026-03-25 03:44:08','2026-03-25 03:44:08','2026-04-01T03:44:08.639Z',1);
INSERT INTO "sessions" ("session_id","user_id","refresh_token_hash","ip_address","device","browser","os","country","login_time","last_active","expires_at","is_active") VALUES('UM7vFuyZAZOOl6Y20pkx3BkoStl4CpRs','7','26df91309f8495af69b7124105d68aa8b45ad914df79fc6abc2419d0a5518af8','2409:40e4:11f6:9ec9:a8f2:1d78:d662:85fa','Desktop','Chrome','macOS','IN','2026-03-25 04:01:30','2026-03-25 04:01:30','2026-04-01T04:01:30.529Z',1);
INSERT INTO "sessions" ("session_id","user_id","refresh_token_hash","ip_address","device","browser","os","country","login_time","last_active","expires_at","is_active") VALUES('qb0HAy8bacRzY93XqUJO1tSNop5ubtDB','3','da915bd5fdbc82cfde76df0c8c085c1bb3276a90131bdefa1410403a0612433b','2409:40d2:1012:5373:2014:7f9e:4612:a104','Desktop','Chrome','Windows','IN','2026-03-25 06:25:01','2026-03-25 06:25:01','2026-04-01T06:25:01.237Z',1);
INSERT INTO "sessions" ("session_id","user_id","refresh_token_hash","ip_address","device","browser","os","country","login_time","last_active","expires_at","is_active") VALUES('ChfCcGAbxSXAUx2LWIDUbMAFk5wM6V0Z','3','2d51cb37d11b4272a557e74a4ae616add3da7aba82cab77ea9ee838cafe359f6','2409:40d2:1260:9422:adb8:c198:b761:2fe2','Desktop','Chrome','Windows','IN','2026-04-01 05:37:56','2026-04-01 05:37:56','2026-04-08T05:37:56.281Z',1);
INSERT INTO "sessions" ("session_id","user_id","refresh_token_hash","ip_address","device","browser","os","country","login_time","last_active","expires_at","is_active") VALUES('zrGScObakVsKX4LFiDtruci6GpaGkFcY','2','503f565bce869f3132e585734b971affa93fcecc30054b273030830fe83f22a1','2409:40e4:6c:a3e2:1c31:ecf7:9a52:9507','Desktop','Chrome','macOS','IN','2026-04-01 07:39:38','2026-04-01 07:39:38','2026-04-08T07:39:38.023Z',1);
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('users',8);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('auth',7);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('password_reset_tokens',14);
