# BACKEND для MEMORY-APP

Написан на expressjs, роуты для постов и пользователя  

Реализована функция авторизации на access и refresh токенах. Есть возможность создания, редактирования постов, возможность удалить и поставить лайк. 
Лайки могут ставить только авторизованные пользователи, есть middleware с проверкой токена. Удаление и редактирование доступно только для автора поста.
Так же есть роуты для поиска по названию постов и тэгам. В детальной информации поста, есть возможность поставить комментарии  

[FRONTEND](https://github.com/andrew28092002/react-mern-memory)
