#include <iostream>
using namespace std;

class Women {
public:
    string name;
    int age;
    void show(){
        cout<< "Name : "<<name<<endl;
        cout<<"Age : "<<age<<endl;
    }
};

int main() {
    Women woman;
    woman.name = "woman";
    woman.age = 20;
    woman.show();
    return 0;

}